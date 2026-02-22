import { ref, onMounted } from 'vue';
import { focus_areas_api } from '@/api_factory/modules/focusAreas';

export const useFetchFocusAreas = () => {
  const loading = ref(false);
  const focusAreas = ref<any[]>([]);
  const error = ref<string | null>(null);

  const fetchFocusAreas = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await focus_areas_api.getFocusAreas() as any;

      if ([200, 201].includes(res?.status)) {
        focusAreas.value = res.data?.data ?? res.data ?? [];
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch focus areas';
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchFocusAreas);

  return { loading, focusAreas, error, fetchFocusAreas };
};
