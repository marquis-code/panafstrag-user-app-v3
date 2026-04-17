import { responsibilityApiFactory } from "@/api_factory/modules/responsibility";

export const useFetchResponsibilities = () => {
  const { data: responsibilities, pending: loading, refresh: fetchResponsibilities } = useAsyncData(
    'responsibilities',
    async () => {
      const res = await responsibilityApiFactory.getAll();
      return res.data ?? [];
    },
    {
      lazy: true,
      server: true
    }
  );

  return { fetchResponsibilities, responsibilities: responsibilities || ref([]), loading };
};

