import { board_api } from '@/api_factory/modules/board';

export const useFetchBoardMember = () => {
  const route = useRoute();
  const id = computed(() => route.params.id as string);

  const { data: boardMember, pending: loading, error, refresh: fetchBoardMember } = useAsyncData(
    `board-member-${id.value}`,
    async () => {
      if (!id.value) return null;
      const res = await board_api.getMember(id.value) as any;
      return res.data?.data ?? res.data ?? null;
    },
    {
      watch: [id],
      lazy: true,
      server: true
    }
  );

  return { loading, boardMember, error, fetchBoardMember };
};

