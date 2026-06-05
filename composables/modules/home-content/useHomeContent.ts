import { homeContentApiFactory } from "@/api_factory/modules/home-content";

const getCacheKey = () => {
  if (typeof window === 'undefined') return 'panafstrag_home_content_cache_v2_en';
  const lang = localStorage.getItem('app-lang') || 'en';
  return `panafstrag_home_content_cache_v2_${lang}`;
};

const readCache = (): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getCacheKey());
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeCache = (data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getCacheKey(), JSON.stringify(data));
  } catch {}
};

export const useHomeContent = () => {
  const { data: homeContent, pending: loading, error, refresh: fetchHomeContent } = useAsyncData(
    `home-content-v2_${typeof window !== 'undefined' ? localStorage.getItem('app-lang') || 'en' : 'en'}`,
    async () => {
      const res = await homeContentApiFactory.getHomeContent() as any;
      if (res?.data) {
        writeCache(res.data);
      }
      return res.data;
    },
    {
      
      initialCache: true, lazy: true, server: false,
      default: () => readCache()
    }
  );

  return { fetchHomeContent, homeContent, loading, error };
};

