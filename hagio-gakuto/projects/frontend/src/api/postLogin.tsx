import { apiClient } from "./apiClient";

export const login = (data: { email: string; password: string }) => {
  return apiClient.post("/login", data);
};
