import { Post, Breed } from "../feed/posts/type.js";

/**
 * 💡 共通の fetch ラッパー関数
 * トークンの付与やエラーハンドリングをここ一箇所に集約する
 */
// frontend/api.ts
const apiRequest = async (url: string, options: RequestInit = {}) => {
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

    // 💡 404や500エラーをここで確実にキャッチ
    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: "サーバーエラー🐾" }));
      throw new Error(err.message);
    }

    return await res.json();
  } catch (error) {
    // 💡 通信失敗（Network Error等）をここでキャッチ
    console.error("API Request Error:", error);
    throw error;
  }
};

export const PostApi = {
  // 投稿一覧を取得
  fetchTimeline: (search?: string): Promise<Post[]> => {
    const url = search
      ? `/api/posts?search=${encodeURIComponent(search)}`
      : "/api/posts";
    return apiRequest(url);
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
    const url = userId ? `/api/mypage?userId=${userId}` : "/api/mypage";
    return apiRequest(url);
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
