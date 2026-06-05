import { language_groups_api } from '@/api_factory/modules/languageGroups';
import { useI18n } from '@/composables/useI18n';

export const useFetchLanguageGroups = () => {
  const { locale } = useI18n();
  const { data: languageGroups, pending: loading, error, refresh: fetchLanguageGroups } = useAsyncData(
    'language-groups-list',
    async () => {
      const res = await language_groups_api.getLanguageGroups() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      
      watch: [locale],
      server: true
    }
  );

  return { loading, languageGroups: languageGroups || ref([]), error, fetchLanguageGroups };
};

