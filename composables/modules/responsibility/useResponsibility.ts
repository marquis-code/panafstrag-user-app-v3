import { responsibilityApiFactory } from "@/api_factory/modules/responsibility";
import { useApiCache } from '@/composables/useApiCache';
import { useI18n } from '@/composables/useI18n';

export const useFetchResponsibilities = () => {
  const { locale } = useI18n();
  const { readCache, writeCache, getCacheKey } = useApiCache();
  const baseKey = 'responsibilities';

  const { data: responsibilities, pending: loading, refresh: fetchResponsibilities } = useAsyncData(`${baseKey}-${locale.value}`,
    async () => {
      const res = await responsibilityApiFactory.getAll();
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

  return { fetchResponsibilities, responsibilities: responsibilities || ref([]), loading };
};

