import { archives_api } from '@/api_factory/modules/archives';

export const useFetchArchives = () => {
  const { data: archives, pending: loading, error, refresh: fetchArchives } = useAsyncData(
    'archives-list',
    async () => {
      const res = await archives_api.getArchives() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      lazy: true,
      server: true
    }
  );

  return { loading, archives: archives || ref([]), error, fetchArchives };
};

