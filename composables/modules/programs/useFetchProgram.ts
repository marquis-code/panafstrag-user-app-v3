import { ref } from 'vue';
import { programs_api } from '@/api_factory/modules/programs';

export const useFetchProgram = () => {
  const loading = ref(false);
  const program = ref<any>(null);
  const error = ref<string | null>(null);
  const route = useRoute();

  const fetchProgram = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await programs_api.getProgram(id) as any;

      if ([200, 201].includes(res?.status)) {
        program.value = res.data?.data ?? res.data ?? null;
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch program details';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    if(route.params.id){
      fetchProgram(route.params.id as string)
    }
  })

  return { loading, program, error, fetchProgram };
};
