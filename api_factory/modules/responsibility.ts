import { GATEWAY_ENDPOINT } from "../axios.config";

export const responsibilityApiFactory = {
  getAll() {
    return GATEWAY_ENDPOINT.get("/responsibility");
  },
};
