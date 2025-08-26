import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

type AuthStatus = {
    isLoggedIn: boolean;
    userId: string | null;
};

export function useAuthStatus() {
    const [authStatus, setAuthStatus] = useState<AuthStatus>({
        isLoggedIn: false,
        userId: null,
    });

    useEffect(() => {
        axios
            .get(API_ENDPOINTS.AUTH_STATUS, { withCredentials: true })
            .then((res) => setAuthStatus(res.data))
            .catch(() => setAuthStatus({ isLoggedIn: false, userId: null }));
    }, []);

    return authStatus;
}
