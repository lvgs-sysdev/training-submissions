import { apiClient } from "./apiClient";

export const logout = () => {
  return apiClient.post("/logout");
};
