import { ref, onMounted } from 'vue';
import { activeBannerApi } from '@/api_factory/modules/active-banner';

export const useActiveBanner = () => {
  const activeBanner = ref<any>(null);
  const loading = ref(false);

  const fetchActiveBanner = async () => {
    loading.value = true;
    try {
      const res = await activeBannerApi.getCurrent() as any;
      if ([200, 201].includes(res?.status)) {
        activeBanner.value = res.data;
      }
    } catch (err) {
      // Silently fail — no banner is fine
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchActiveBanner);

  return { activeBanner, loading, fetchActiveBanner };
};
