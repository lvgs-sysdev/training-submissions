import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import type { User, FetchedUser, AuthContextType } from '../types/user';
import { API_ENDPOINTS } from '../constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get(API_ENDPOINTS.AUTH_STATUS, { withCredentials: true })
            .then(async (res) => {
                if (res.data.isLoggedIn) {
                    const basicUser = res.data.user;

                    const profileRes = await axios.get(
                        API_ENDPOINTS.USER_PROFILE(basicUser.account_id),
                        { withCredentials: true }
                    );

                    const fullUser: FetchedUser = profileRes.data.user;

                    setUser({
                        id: fullUser.id,
                        account_id: fullUser.userId,
                        user_name: fullUser.name,
                        user_image: fullUser.avatarImageUrl,
                        bio: fullUser.bio,
                        banner_image: fullUser.bannerImageUrl,
                    });
                } else {
                    setUser(null);
                }
            })
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    const login = (userData: User) => setUser(userData);

    const logout = async () => {
        await axios.post(API_ENDPOINTS.LOGOUT, {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
