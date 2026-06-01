import { archives_api } from '@/api_factory/modules/archives';

export const useFetchArchives = () => {
  const { data: archives, pending: loading, error, refresh: fetchArchives } = useAsyncData(
    `archives-list_${typeof window !== 'undefined' ? localStorage.getItem('app-lang') || 'en' : 'en'}`,
    async () => {
      const res = await archives_api.getArchives() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      
      server: true
    }
  );

  return { loading, archives: archives || ref([]), error, fetchArchives };
};

