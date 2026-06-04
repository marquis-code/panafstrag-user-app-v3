import { responsibilityApiFactory } from "@/api_factory/modules/responsibility";
import { useApiCache } from '@/composables/useApiCache';

export const useFetchResponsibilities = () => {
  const { readCache, writeCache, getCacheKey } = useApiCache();
  const baseKey = 'responsibilities';

  const { data: responsibilities, pending: loading, refresh: fetchResponsibilities } = useAsyncData(
    getCacheKey(baseKey),
    async () => {
      const res = await responsibilityApiFactory.getAll();
      const parsedData = res.data ?? [];
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

  return { fetchResponsibilities, responsibilities: responsibilities || ref([]), loading };
};

