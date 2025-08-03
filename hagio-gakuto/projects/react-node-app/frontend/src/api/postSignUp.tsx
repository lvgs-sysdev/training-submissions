import { apiClient } from "./apiClient";

export const postSignup = (data: { email: string; password: string }) => {
  return apiClient.post("/signup", data);
};
