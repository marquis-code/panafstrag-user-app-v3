import { objectiveApiFactory } from "@/api_factory/modules/objective";

export const useFetchObjectives = () => {
  const { data: objectives, pending: loading, refresh: fetchObjectives } = useAsyncData(
    `objectives_${typeof window !== 'undefined' ? localStorage.getItem('app-lang') || 'en' : 'en'}`,
    async () => {
      const res = await objectiveApiFactory.getAll();
      return res.data ?? [];
    },
    {
      
      server: true
    }
  );

  return { fetchObjectives, objectives: objectives || ref([]), loading };
};

