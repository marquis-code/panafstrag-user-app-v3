import { focus_areas_api } from '@/api_factory/modules/focusAreas';
import { useApiCache } from '@/composables/useApiCache';

export const useFetchFocusAreas = () => {
  const { readCache, writeCache, getCacheKey } = useApiCache();
  const baseKey = 'focus-areas-list';

  const { data: focusAreas, pending: loading, error, refresh: fetchFocusAreas } = useAsyncData(
    getCacheKey(baseKey),
    async () => {
      const res = await focus_areas_api.getFocusAreas() as any;
      const parsedData = res.data?.data ?? res.data ?? [];
      if (parsedData.length > 0) {
        writeCache(baseKey, parsedData);
      }
      return parsedData;
    },
    {
      server: true,
      default: () => readCache(baseKey)
    }
  );

  return { loading, focusAreas: focusAreas || ref([]), error, fetchFocusAreas };
};

