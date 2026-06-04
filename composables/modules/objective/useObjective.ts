import { objectiveApiFactory } from "@/api_factory/modules/objective";
import { useApiCache } from '@/composables/useApiCache';

export const useFetchObjectives = () => {
  const { readCache, writeCache, getCacheKey } = useApiCache();
  const baseKey = 'objectives';

  const { data: objectives, pending: loading, refresh: fetchObjectives } = useAsyncData(
    getCacheKey(baseKey),
    async () => {
      const res = await objectiveApiFactory.getAll();
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

  return { fetchObjectives, objectives: objectives || ref([]), loading };
};

