import { focus_areas_api } from '@/api_factory/modules/focusAreas';
import { useApiCache } from '@/composables/useApiCache';
import { useI18n } from '@/composables/useI18n';

export const useFetchFocusAreas = () => {
  const { locale } = useI18n();
  const { readCache, writeCache, getCacheKey } = useApiCache();
  const baseKey = 'focus-areas-list';

  const { data: focusAreas, pending: loading, error, refresh: fetchFocusAreas } = useAsyncData(`${baseKey}-${locale.value}`,
    async () => {
      const res = await focus_areas_api.getFocusAreas() as any;
      const parsedData = res.data?.data ?? res.data ?? [];
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

  return { loading, focusAreas: focusAreas || ref([]), error, fetchFocusAreas };
};

