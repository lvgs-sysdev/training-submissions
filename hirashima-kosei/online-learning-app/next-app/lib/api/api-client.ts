import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FASTIFY_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw { status: error.response.status, msg: error.response.data?.error ?? "" };
    } else {
      throw { status: 500, msg: "接続エラーが発生しました。" };
    }
  }
);

const axiosServerClient = axios.create({
  baseURL: process.env.FASTIFY_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosServerClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw { status: error.response.status, msg: error.response.data?.error ?? "" };
    } else {
      throw { status: 500, msg: "接続エラーが発生しました。" };
    }
  }
);

const nextAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEXT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

nextAxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw { status: error.response.status, msg: error.response.data?.error ?? "" };
    } else {
      throw { status: 500, msg: "接続エラーが発生しました。" };
    }
  }
);

export { axiosClient, axiosServerClient, nextAxiosClient };
