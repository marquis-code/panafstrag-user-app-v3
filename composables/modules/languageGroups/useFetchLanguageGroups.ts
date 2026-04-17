import { language_groups_api } from '@/api_factory/modules/languageGroups';

export const useFetchLanguageGroups = () => {
  const { data: languageGroups, pending: loading, error, refresh: fetchLanguageGroups } = useAsyncData(
    'language-groups-list',
    async () => {
      const res = await language_groups_api.getLanguageGroups() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      lazy: true,
      server: true
    }
  );

  return { loading, languageGroups: languageGroups || ref([]), error, fetchLanguageGroups };
};

