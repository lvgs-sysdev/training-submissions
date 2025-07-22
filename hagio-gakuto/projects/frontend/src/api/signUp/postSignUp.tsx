import { apiClient } from "../apiClient";

export const signup = (data: { email: string; password: string }) => {
  return apiClient.post("/signup", data);
};
