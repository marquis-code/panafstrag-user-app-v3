import { homeContentApiFactory } from "@/api_factory/modules/home-content";
import { useI18n } from '@/composables/useI18n';

const getCacheKey = (localeStr: string) => {
  return `panafstrag_home_content_cache_v2_${localeStr}`;
};

const readCache = (localeStr: string): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getCacheKey(localeStr));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeCache = (localeStr: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getCacheKey(localeStr), JSON.stringify(data));
  } catch {}
};

export const useHomeContent = () => {
  const { locale } = useI18n();
  const { data: homeContent, pending: loading, error, refresh: fetchHomeContent } = useAsyncData(`home-content-v2-${locale.value}`,
    async () => {
      const res = await homeContentApiFactory.getHomeContent() as any;
      if (res?.data) {
        writeCache(locale.value, res.data);
      }
      return res.data;
    },
    {
      watch: [locale],
      initialCache: true, lazy: true, server: false,
      default: () => readCache(locale.value)
    }
  );

  return { fetchHomeContent, homeContent, loading, error };
};

