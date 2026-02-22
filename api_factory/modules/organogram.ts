import { GATEWAY_ENDPOINT } from '../axios.config'

export const organogramApiFactory = {
  getOrganogramNodes() {
    return GATEWAY_ENDPOINT.get('/organogram')
  }
}
