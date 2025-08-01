import { useState, useEffect } from 'react';
import axios from 'axios';
import type { User, FetchedUser, UserResponse } from '../types/user';
import { API_ENDPOINTS, UI_MESSAGES } from '../constants';
import { convertFetchedToUser } from '../utils/convertUser';

export function useUser(userId?: string) {
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get<UserResponse>(
                API_ENDPOINTS.USER_PROFILE(userId), 
                { withCredentials: true }
            );

            const rawUser: FetchedUser = response.data.user;
            setUser(convertFetchedToUser(rawUser));
        } catch (err) {
            console.error('ユーザー情報取得エラー:', err);
            setError(UI_MESSAGES.USER_NOT_FOUND);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    return {
        user,
        loading,
        error,
        fetchUser,
    };
} 