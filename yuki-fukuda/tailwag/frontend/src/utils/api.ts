import { Post, Breed } from "../feed/posts/type";

/**
 * 💡 バックエンドの基本URLを定義
 * 開発環境では localhost:3000 を指定します。
 */
const BASE_URL = "http://localhost:3000";

/**
 * 💡 共通の fetch ラッパー関数
 * path: "/api/posts" のようなスラッシュから始まるパスを受け取ります。
 */
const apiRequest = async (path: string, options: RequestInit = {}) => {
  // 1. フルURLを作成 (例: http://localhost:3000/api/posts)
  const url = `${BASE_URL}${path}`;

  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers: headers,
  };

  try {
    const res = await fetch(url, config);

    // 💡 404や500エラーをキャッチ
    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: "サーバーエラー🐾" }));
      throw new Error(err.message);
    }

    return await res.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const PostApi = {
  // 投稿一覧を取得
  fetchTimeline: (search?: string): Promise<Post[]> => {
    const path = search
      ? `/api/posts?search=${encodeURIComponent(search)}`
      : "/api/posts";
    return apiRequest(path);
  },

  // 犬種リストを取得
  fetchBreeds: (): Promise<Breed[]> => apiRequest("/api/breeds"),

  // 投稿を送信
  createPost: (formData: FormData) =>
    apiRequest("/api/posts", {
      method: "POST",
      body: formData,
    }),

  // いいね処理
  toggleLike: (postId: number) =>
    apiRequest(`/api/posts/${postId}/like`, {
      method: "POST",
    }),

  // プロフィールと投稿の取得
  fetchMypage: (userId?: number) => {
    const path = userId ? `/api/mypage?userId=${userId}` : "/api/mypage";
    return apiRequest(path);
  },

  // フォロー・解除
  toggleFollow: (userId: number) =>
    apiRequest(`/users/${userId}/follow`, {
      method: "POST",
    }),

  // プロフィール編集
  updateProfile: (formData: FormData) =>
    apiRequest("/api/mypage/edit", {
      method: "PATCH",
      body: formData,
    }),
};
