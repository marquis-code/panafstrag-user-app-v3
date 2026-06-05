import { programs_api } from '@/api_factory/modules/programs';
import { useI18n } from '@/composables/useI18n';

export const useFetchProgram = () => {
  const { locale } = useI18n();
  const route = useRoute();
  const id = computed(() => route.params.id as string);

  const { data: program, pending: loading, error, refresh: fetchProgram } = useAsyncData(`program-${id.value}-${locale.value}`,
    async () => {
      if (!id.value) return null;
      const res = await programs_api.getProgram(id.value) as any;
      return res.data?.data ?? res.data ?? null;
    },
    {
      watch: [id, locale],
      server: true
    }
  );

  return { loading, program, error, fetchProgram };
};

