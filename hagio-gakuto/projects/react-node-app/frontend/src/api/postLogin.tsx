import { apiClient } from "./apiClient";

export const postLogin = (data: { email: string; password: string }) => {
  return apiClient.post("/login", data);
};
