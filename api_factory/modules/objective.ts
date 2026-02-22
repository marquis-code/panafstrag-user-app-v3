import { GATEWAY_ENDPOINT } from "../axios.config";

export const objectiveApiFactory = {
  getAll() {
    return GATEWAY_ENDPOINT.get("/objective");
  },
};
