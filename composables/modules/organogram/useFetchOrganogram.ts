import { organogramApiFactory } from '@/api_factory/modules/organogram'

export const useFetchOrganogram = () => {
  const { locale } = useI18n();
  const { data: organogramNodes, pending: loading, refresh: fetchOrganogram } = useAsyncData(
    'organogram-nodes',
    async () => {
      const response = await organogramApiFactory.getOrganogramNodes()
      return response.data ?? []
    },
    {
      
      watch: [locale],
      server: true
    }
  )

  return {
    loading,
    organogramNodes: organogramNodes || ref([]),
    fetchOrganogram
  }
}

