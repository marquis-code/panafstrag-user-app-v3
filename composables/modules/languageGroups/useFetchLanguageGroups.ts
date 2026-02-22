import { ref, onMounted } from 'vue';
import { language_groups_api } from '@/api_factory/modules/languageGroups';

export const useFetchLanguageGroups = () => {
  const loading = ref(false);
  const languageGroups = ref<any[]>([]);
  const error = ref<string | null>(null);

  const fetchLanguageGroups = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await language_groups_api.getLanguageGroups() as any;

      if ([200, 201].includes(res?.status)) {
        languageGroups.value = res.data?.data ?? res.data ?? [];
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch language groups';
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchLanguageGroups);

  return { loading, languageGroups, error, fetchLanguageGroups };
};
