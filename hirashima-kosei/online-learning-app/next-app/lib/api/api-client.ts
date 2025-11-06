import axios from "axios";

// クライアントサイドでAxiosクライアントを利用する場合
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

// サーバーコンポーネントでAxiosクライアントを利用する場合
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

// Next.jsのAPIエンドポイントを経由する形でAxiosクライアントを利用する場合（主にcookie関連用途）
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
