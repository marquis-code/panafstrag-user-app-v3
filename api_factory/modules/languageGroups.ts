import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const language_groups_api = {
  getLanguageGroups: () => {
    return GATEWAY_ENDPOINT.get('/language-group');
  },
  getLanguageGroup: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/language-group/${id}`);
  },
  createLanguageGroup: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/language-group', payload);
  },
  updateLanguageGroup: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT.patch(`/language-group/${id}`, payload);
  },
  deleteLanguageGroup: (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/language-group/${id}`);
  },
};
