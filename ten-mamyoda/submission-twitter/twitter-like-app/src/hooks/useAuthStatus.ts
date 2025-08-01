import { useEffect, useState } from 'react';
import axios from 'axios';

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
            .get('/api/users/auth/status', { withCredentials: true })
            .then((res) => setAuthStatus(res.data))
            .catch(() => setAuthStatus({ isLoggedIn: false, userId: null }));
    }, []);

    return authStatus;
}
