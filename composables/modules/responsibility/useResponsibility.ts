import { responsibilityApiFactory } from "@/api_factory/modules/responsibility";

export const useFetchResponsibilities = () => {
  const responsibilities = ref([]);
  const loading = ref(false);

  const fetchResponsibilities = async () => {
    loading.value = true;
    try {
      const res = await responsibilityApiFactory.getAll();
      responsibilities.value = res.data;
    } catch (error) {
    } finally {
      loading.value = false;
    }
  };

  return { fetchResponsibilities, responsibilities, loading };
};
