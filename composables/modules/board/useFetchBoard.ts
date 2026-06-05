import { board_api } from '@/api_factory/modules/board';
import { useI18n } from '@/composables/useI18n';

export const useFetchBoard = () => {
  const { locale } = useI18n();
  const { data: boardMembers, pending: loading, error, refresh: fetchBoard } = useAsyncData(
    'board-members-list',
    async () => {
      const res = await board_api.getMembers() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      
      watch: [locale],
      server: true
    }
  );

  return { loading, boardMembers: boardMembers || ref([]), error, fetchBoard };
};

