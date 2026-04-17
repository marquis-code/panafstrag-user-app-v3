import { homeContentApiFactory } from "@/api_factory/modules/home-content";

const CACHE_KEY = 'panafstrag_home_content_cache';

const readCache = (): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeCache = (data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
};

export const useHomeContent = () => {
  const { data: homeContent, pending: loading, error, refresh: fetchHomeContent } = useAsyncData(
    'home-content',
    async () => {
      const res = await homeContentApiFactory.getHomeContent() as any;
      if (res?.data) {
        writeCache(res.data);
      }
      return res.data;
    },
    {
      lazy: true,
      initialCache: true,
      default: () => readCache()
    }
  );

  return { fetchHomeContent, homeContent, loading, error };
};

