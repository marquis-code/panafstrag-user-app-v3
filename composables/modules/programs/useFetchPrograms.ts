import { programs_api } from '@/api_factory/modules/programs';

export const useFetchPrograms = () => {
  const { data: programs, pending: loading, error, refresh: fetchPrograms } = useAsyncData(
    `programs-list_${typeof window !== 'undefined' ? localStorage.getItem('app-lang') || 'en' : 'en'}`,
    async () => {
      const res = await programs_api.getPrograms() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      initialCache: true,
      }
  );

  return { loading, programs: programs || ref([]), error, fetchPrograms };
};

