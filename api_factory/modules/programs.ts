import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const programs_api = {
  getPrograms: () => {
    return GATEWAY_ENDPOINT.get('/program');
  },
  getUpcomingPrograms: () => {
    return GATEWAY_ENDPOINT.get('/program/upcoming');
  },
  getPastPrograms: () => {
    return GATEWAY_ENDPOINT.get('/program/past');
  },
  getProgram: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/program/${id}`);
  },
  createProgram: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/program', payload);
  },
  updateProgram: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT.patch(`/program/${id}`, payload);
  },
  deleteProgram: (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/program/${id}`);
  },
};
