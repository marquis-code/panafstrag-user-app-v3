import { objectiveApiFactory } from "@/api_factory/modules/objective";

export const useFetchObjectives = () => {
  const { data: objectives, pending: loading, refresh: fetchObjectives } = useAsyncData(
    'objectives',
    async () => {
      const res = await objectiveApiFactory.getAll();
      return res.data ?? [];
    },
    {
      lazy: true,
      server: true
    }
  );

  return { fetchObjectives, objectives: objectives || ref([]), loading };
};

