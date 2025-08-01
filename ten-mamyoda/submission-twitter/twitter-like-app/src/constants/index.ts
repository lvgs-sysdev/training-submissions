// src/constants/index.ts

export const UI_MESSAGES = {
    LOADING: '読み込み中...',
    POST_NOT_FOUND: '投稿が見つかりません',
    POST_CREATED: '投稿が完了しました！',
    POST_ERROR: '投稿中にエラーが発生しました',
    USER_NOT_FOUND: 'ユーザーが見つかりません',
    LOGIN_REQUIRED: 'ログインが必要です',
    DUPLICATE_USER_ID: 'そのユーザーIDは既に使用されています',
    NETWORK_ERROR: 'ネットワークエラーが発生しました',
    GENERAL_ERROR: 'エラーが発生しました',
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    CREATE_POST: '/create-post',
    EDIT_PROFILE: '/profile/edit',
    USER_PROFILE: (userId: string) => `/user/${userId}`,
    NOT_FOUND: '/404',
} as const;

export const API_ENDPOINTS = {
    POSTS: '/api/posts',
    POSTS_BY_USER: (userId: string) => `/api/posts/by-user/${userId}`,
    POST_UPLOAD: '/api/posts/upload',
    USER_PROFILE: (userId: string) => `/api/users/profile/${userId}`,
    USER_PROFILE_UPDATE: '/api/users/profile/update',
    USER_CHECK_DUPLICATE: '/api/users/check-duplicate',
    AUTH_STATUS: '/api/users/auth/status',
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    LOGOUT: '/api/users/auth/logout',
    RECOMMENDED_USERS: '/api/users/recommendations',
} as const;

export const CONFIG = {
    API_BASE_URL: 'http://localhost:3000',
    DEFAULT_AVATAR_URL: 'http://localhost:3000/images/default-avatar.png',
    DEFAULT_BANNER_URL: 'http://localhost:3000/images/default-banner.png',
} as const;

// ダミーデータ（実際のAPIができるまで使用）
export const DUMMY_RECOMMENDED_USERS = [
    {
        id: '1',
        name: '田中太郎',
        userId: 'tanaka_taro',
        imageUrl: '/images/default-avatar.png',
        bio: 'プログラマーです',
        bannerImageUrl: '/images/default-banner.png',
    },
    {
        id: '2',
        name: '佐藤花子',
        userId: 'sato_hanako',
        imageUrl: '/images/default-avatar.png',
        bio: 'デザイナーです',
        bannerImageUrl: '/images/default-banner.png',
    },
    {
        id: '3',
        name: 'Mike Johnson',
        userId: 'mike_johnson',
        imageUrl: '/images/default-avatar.png',
        bio: 'Software Engineer',
        bannerImageUrl: '/images/default-banner.png',
    },
] as const;
