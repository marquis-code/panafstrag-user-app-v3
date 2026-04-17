import { programs_api } from '@/api_factory/modules/programs';

export const useFetchPrograms = () => {
  const { data: programs, pending: loading, error, refresh: fetchPrograms } = useAsyncData(
    'programs-list',
    async () => {
      const res = await programs_api.getPrograms() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      initialCache: true,
      lazy: true
    }
  );

  return { loading, programs: programs || ref([]), error, fetchPrograms };
};

