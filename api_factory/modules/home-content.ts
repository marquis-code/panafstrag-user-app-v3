import { GATEWAY_ENDPOINT } from "../axios.config";

export const homeContentApiFactory = {
  getHomeContent() {
    return GATEWAY_ENDPOINT.get("/home-content");
  },
};
