import { objectiveApiFactory } from "@/api_factory/modules/objective";

export const useFetchObjectives = () => {
  const objectives = ref([]);
  const loading = ref(false);

  const fetchObjectives = async () => {
    loading.value = true;
    try {
      const res = await objectiveApiFactory.getAll();
      objectives.value = res.data;
    } catch (error) {
    } finally {
      loading.value = false;
    }
  };

  return { fetchObjectives, objectives, loading };
};
