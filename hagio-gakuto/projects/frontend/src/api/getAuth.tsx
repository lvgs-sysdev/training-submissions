import { apiClient } from "./apiClient";

export const me = () => {
  return apiClient.get("/auth/me");
};
