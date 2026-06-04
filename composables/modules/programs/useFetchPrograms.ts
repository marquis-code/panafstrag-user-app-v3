import { programs_api } from '@/api_factory/modules/programs';
import { useApiCache } from '@/composables/useApiCache';

export const useFetchPrograms = () => {
  const { readCache, writeCache, getCacheKey } = useApiCache();
  const baseKey = 'programs-list';

  const { data: programs, pending: loading, error, refresh: fetchPrograms } = useAsyncData(
    getCacheKey(baseKey),
    async () => {
      const res = await programs_api.getPrograms() as any;
      const parsedData = res.data?.data ?? res.data ?? [];
      if (parsedData.length > 0) {
        writeCache(baseKey, parsedData);
      }
      return parsedData;
    },
    {
      initialCache: true, lazy: true, server: false,
      default: () => readCache(baseKey)
    }
  );

  return { loading, programs: programs || ref([]), error, fetchPrograms };
};

