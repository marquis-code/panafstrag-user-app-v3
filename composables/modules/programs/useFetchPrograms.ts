import { programs_api } from '@/api_factory/modules/programs';
import { useApiCache } from '@/composables/useApiCache';
import { useI18n } from '@/composables/useI18n';

export const useFetchPrograms = () => {
  const { locale } = useI18n();
  const { readCache, writeCache, getCacheKey } = useApiCache();
  const baseKey = 'programs-list';

  const { data: programs, pending: loading, error, refresh: fetchPrograms } = useAsyncData(
    baseKey,
    async () => {
      const res = await programs_api.getPrograms() as any;
      const parsedData = res.data?.data ?? res.data ?? [];
      if (parsedData.length > 0) {
        writeCache(baseKey, parsedData, locale.value);
      }
      return parsedData;
    },
    {
      watch: [locale],
      initialCache: true, lazy: true, server: false,
      default: () => readCache(baseKey, locale.value)
    }
  );

  return { loading, programs: programs || ref([]), error, fetchPrograms };
};

