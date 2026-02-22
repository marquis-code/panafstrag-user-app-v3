import { ref } from 'vue';
import { board_api } from '@/api_factory/modules/board';

export const useFetchBoardMember = () => {
  const loading = ref(false);
  const boardMember = ref<any>(null);
  const error = ref<string | null>(null);
  const route = useRoute();

  const fetchBoardMember = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await board_api.getMember(id) as any;

      if ([200, 201].includes(res?.status)) {
        boardMember.value = res.data?.data ?? res.data ?? null;
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch board member details';
      throw err;
    } finally {
      loading.value = false;
    }
  };


  onMounted(() => {
    if(route.params.id){
      fetchBoardMember(route.params.id as string)
    }
  })

  return { loading, boardMember, error, fetchBoardMember };
};
