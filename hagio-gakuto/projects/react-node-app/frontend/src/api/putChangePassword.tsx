import { apiClient } from "./apiClient";

export const putChangePassword = (data: {
  password: string;
  newPassword: string;
}) => {
  return apiClient.put("/password", data);
};
