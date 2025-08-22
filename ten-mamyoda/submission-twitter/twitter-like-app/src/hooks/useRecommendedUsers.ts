// src/hooks/useRecommendedUsers.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { RecommendedUser } from '../types/user';
import { API_ENDPOINTS } from '../constants';

interface UseRecommendedUsersReturn {
    users: RecommendedUser[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useRecommendedUsers(currentUserId?: string | null, limit: number = 5): UseRecommendedUsersReturn {
    const [users, setUsers] = useState<RecommendedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecommendedUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // バックエンドAPIを呼び出し
            const response = await axios.get(API_ENDPOINTS.RECOMMENDED_USERS, {
                params: {
                    currentUserId,
                    limit
                },
                withCredentials: true 
            });
            
            // バックエンドのレスポンス形式に合わせて変換
            const usersData = response.data.users ?? []; 
            const transformedUsers: RecommendedUser[] = usersData.map((user: any) => ({
                id: user.id,
                name: user.name,
                userId: user.userId, // account_id
                imageUrl: user.imageUrl // user_image
            }));
            
            setUsers(transformedUsers);
            
        } catch (err) {
            console.error('推奨ユーザー取得エラー:', err);
            setError('推奨ユーザーの取得に失敗しました');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendedUsers();
    }, [currentUserId, limit]);

    return {
        users,
        loading,
        error,
        refetch: fetchRecommendedUsers
    };
}
