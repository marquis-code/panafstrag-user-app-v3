import { focus_areas_api } from '@/api_factory/modules/focusAreas';

export const useFetchFocusAreas = () => {
  const { data: focusAreas, pending: loading, error, refresh: fetchFocusAreas } = useAsyncData(
    'focus-areas-list',
    async () => {
      const res = await focus_areas_api.getFocusAreas() as any;
      return res.data?.data ?? res.data ?? [];
    },
    {
      lazy: true,
      server: true
    }
  );

  return { loading, focusAreas: focusAreas || ref([]), error, fetchFocusAreas };
};

