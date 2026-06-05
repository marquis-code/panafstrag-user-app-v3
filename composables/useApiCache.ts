export const useApiCache = () => {
  const getCacheKey = (baseKey: string, localeStr?: string) => {
    const lang = localeStr || (typeof window !== 'undefined' ? localStorage.getItem('app-lang') : 'en') || 'en';
    return `${baseKey}_v2_${lang}`;
  };

  const readCache = (baseKey: string, localeStr?: string): any | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(getCacheKey(baseKey, localeStr));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeCache = (baseKey: string, data: any, localeStr?: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getCacheKey(baseKey, localeStr), JSON.stringify(data));
    } catch {}
  };

  return { readCache, writeCache, getCacheKey };
};
