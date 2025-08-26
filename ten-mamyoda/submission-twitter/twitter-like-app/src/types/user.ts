export type RecommendedUser = {
    id: string;
    name: string;
    userId: string;
    imageUrl: string;
    bio: string;
    bannerImageUrl: string;
};

export type User = {
    id: string;
    account_id: string;
    user_name: string;
    user_image: string;
    bio?: string;
    banner_image?: string;
};

export type FetchedUser = {
    id: string;
    userId: string;
    name: string;
    avatarImageUrl: string;
    bannerImageUrl?: string;
    bio?: string;
};

export type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
};

// 投稿関連の型定義
export type Post = {
    post_id: number;
    user_name: string;
    userId: string;
    content: string;
    avatarImageUrl: string;
    imagePath: string;
    created_at?: string;
};

export type CreatePostData = {
    content: string;
    imagePath?: string | null;
};

export type PostsResponse = {
    posts: Post[];
};

export type UserResponse = {
    user: FetchedUser;
};
