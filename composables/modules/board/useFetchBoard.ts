import { board_api } from '@/api_factory/modules/board';

export const useFetchBoard = () => {
  const { data: boardMembers, pending: loading, error, refresh: fetchBoard } = useAsyncData(
    'board-members-list',
    async () => {
      const res = await board_api.getMembers() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      lazy: true,
      server: true
    }
  );

  return { loading, boardMembers: boardMembers || ref([]), error, fetchBoard };
};

