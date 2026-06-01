import { organogramApiFactory } from '@/api_factory/modules/organogram'

export const useFetchOrganogram = () => {
  const { data: organogramNodes, pending: loading, refresh: fetchOrganogram } = useAsyncData(
    `organogram-nodes_${typeof window !== 'undefined' ? localStorage.getItem('app-lang') || 'en' : 'en'}`,
    async () => {
      const response = await organogramApiFactory.getOrganogramNodes()
      return response.data ?? []
    },
    {
      
      server: true
    }
  )

  return {
    loading,
    organogramNodes: organogramNodes || ref([]),
    fetchOrganogram
  }
}

