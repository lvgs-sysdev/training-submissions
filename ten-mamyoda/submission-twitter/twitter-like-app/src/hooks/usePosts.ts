import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Post, PostsResponse } from '../types/user';
import { API_ENDPOINTS, UI_MESSAGES } from '../constants';

type UsePostsOptions = {
    userId?: string;
    autoFetch?: boolean;
};

export function usePosts({ userId, autoFetch = true }: UsePostsOptions = {}) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const endpoint = userId 
                ? API_ENDPOINTS.POSTS_BY_USER(userId)
                : API_ENDPOINTS.POSTS;
            
            const response = await axios.get<PostsResponse>(endpoint, { 
                withCredentials: true 
            });
            
            setPosts(response.data.posts);
        } catch (err) {
            console.error('投稿取得エラー:', err);
            setError(UI_MESSAGES.POST_NOT_FOUND);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const createPost = async (content: string, imagePath?: string) => {
        try {
            const replacedContent = content.replace(
                /<img[^>]*>/gi, 
                '<img src="__POST_IMAGE__" alt="投稿画像" />'
            );

            await axios.post(API_ENDPOINTS.POSTS, {
                content: replacedContent,
                imagePath,
            }, { withCredentials: true });

            // 投稿完了後に投稿一覧を再取得
            await fetchPosts();
            
            return { success: true };
        } catch (err) {
            console.error('投稿エラー', err);
            return { success: false, error: UI_MESSAGES.POST_ERROR };
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchPosts();
        }
    }, [userId, autoFetch]);

    return {
        posts,
        loading,
        error,
        fetchPosts,
        createPost,
        setPosts,
    };
} 