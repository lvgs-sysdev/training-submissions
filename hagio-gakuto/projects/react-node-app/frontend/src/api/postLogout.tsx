import { apiClient } from "./apiClient";

export const postLogout = () => {
  return apiClient.post("/logout");
};
