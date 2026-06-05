import { objectiveApiFactory } from "@/api_factory/modules/objective";
import { useApiCache } from '@/composables/useApiCache';
import { useI18n } from '@/composables/useI18n';

export const useFetchObjectives = () => {
  const { locale } = useI18n();
  const { readCache, writeCache, getCacheKey } = useApiCache();
  const baseKey = 'objectives';

  const { data: objectives, pending: loading, refresh: fetchObjectives } = useAsyncData(`${baseKey}-${locale.value}`,
    async () => {
      const res = await objectiveApiFactory.getAll();
      const parsedData = res.data ?? [];
      if (parsedData.length > 0) {
        writeCache(baseKey, parsedData, locale.value);
      }
      return parsedData;
    },
    {
      watch: [locale],
      server: true,
      default: () => readCache(baseKey, locale.value)
    }
  );

  return { fetchObjectives, objectives: objectives || ref([]), loading };
};

