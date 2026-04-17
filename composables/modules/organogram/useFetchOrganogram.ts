import { organogramApiFactory } from '@/api_factory/modules/organogram'

export const useFetchOrganogram = () => {
  const { data: organogramNodes, pending: loading, refresh: fetchOrganogram } = useAsyncData(
    'organogram-nodes',
    async () => {
      const response = await organogramApiFactory.getOrganogramNodes()
      return response.data ?? []
    },
    {
      lazy: true,
      server: true
    }
  )

  return {
    loading,
    organogramNodes: organogramNodes || ref([]),
    fetchOrganogram
  }
}

