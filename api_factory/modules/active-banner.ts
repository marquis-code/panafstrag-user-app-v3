import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const activeBannerApi = {
  getCurrent() {
    return GATEWAY_ENDPOINT.get('/active-banner/current');
  },
};
