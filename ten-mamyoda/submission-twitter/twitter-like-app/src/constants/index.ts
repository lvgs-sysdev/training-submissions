export const UI_MESSAGES = {
    LOADING: '読み込み中...',
    POST_NOT_FOUND: '投稿が見つかりません',
    POST_CREATED: '投稿が完了しました！',
    POST_ERROR: '投稿中にエラーが発生しました',
    USER_REGUSTERED: 'ユーザー登録が完了しました！',
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
    DEFAULT_AVATAR_URL: '/images/default-avatar.png',
    DEFAULT_BANNER_URL: '/images/default-banner.png',
} as const;
