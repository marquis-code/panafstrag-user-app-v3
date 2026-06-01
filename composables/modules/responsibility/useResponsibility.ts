import { responsibilityApiFactory } from "@/api_factory/modules/responsibility";

export const useFetchResponsibilities = () => {
  const { data: responsibilities, pending: loading, refresh: fetchResponsibilities } = useAsyncData(
    `responsibilities_${typeof window !== 'undefined' ? localStorage.getItem('app-lang') || 'en' : 'en'}`,
    async () => {
      const res = await responsibilityApiFactory.getAll();
      return res.data ?? [];
    },
    {
      
      server: true
    }
  );

  return { fetchResponsibilities, responsibilities: responsibilities || ref([]), loading };
};

