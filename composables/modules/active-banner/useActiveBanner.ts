import { activeBannerApi } from '@/api_factory/modules/active-banner';
import { useI18n } from '@/composables/useI18n';

export const useActiveBanner = () => {
  const { locale } = useI18n();
  const { data: activeBanner, pending: loading, refresh: fetchActiveBanner } = useAsyncData(
    'active-banner',
    async () => {
      const res = await activeBannerApi.getCurrent() as any;
      if ([200, 201].includes(res?.status)) {
        return res.data;
      }
      return null;
    },
    {
      
      watch: [locale],
      server: true
    }
  );

  return { activeBanner, loading, fetchActiveBanner };
};

