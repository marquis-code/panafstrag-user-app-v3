import { archives_api } from '@/api_factory/modules/archives';
import { useI18n } from '@/composables/useI18n';

export const useFetchArchives = () => {
  const { locale } = useI18n();
  const { data: archives, pending: loading, error, refresh: fetchArchives } = useAsyncData(`archives-list-${locale.value}`,
    async () => {
      const res = await archives_api.getArchives() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      watch: [locale],
      server: true
    }
  );

  return { loading, archives: archives || ref([]), error, fetchArchives };
};

