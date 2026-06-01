import { activeBannerApi } from '@/api_factory/modules/active-banner';

export const useActiveBanner = () => {
  const { data: activeBanner, pending: loading, refresh: fetchActiveBanner } = useAsyncData(
    `active-banner_${typeof window !== 'undefined' ? localStorage.getItem('app-lang') || 'en' : 'en'}`,
    async () => {
      const res = await activeBannerApi.getCurrent() as any;
      if ([200, 201].includes(res?.status)) {
        return res.data;
      }
      return null;
    },
    {
      
      server: true
    }
  );

  return { activeBanner, loading, fetchActiveBanner };
};

