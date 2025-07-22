import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

// export async function postRequest<T>(url: string, data: any): Promise<T> {
//   try {
//     const response = await apiClient.post<T>(url, data);
//     return response.data;
//   } catch (error: any) {
//     console.log(error);
//     if (axios.isAxiosError(error)) {
//       throw error.response?.data?.message || "サーバーエラー";
//     }
//     throw "通信エラー";
//   }
// }
