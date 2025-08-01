// src/pages/CreatePostPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { BaseLayout } from '../components/layouts/BaseLayout';
import { CenterBarLayout } from '../components/layouts/CenterBarLayout';
import { AppHeader } from '../components/common/AppHeader';
import { CreatePostCenterBar } from '../components/CreatePostCenterBar';
import { convertFetchedToUser } from '../utils/convertUser';
import type { FetchedUser, User } from '../types/user';
import { useAuth } from '../context/AuthContext';

export function CreatePostPage() {
    const navigate = useNavigate();
    const { user: authUser, isLoading } = useAuth();
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        if (!authUser) return;
        axios
            .get(`/api/users/profile/${authUser.account_id}`, { withCredentials: true })
            .then((res) => {
                const rawUser: FetchedUser = res.data.user;
                setUser(convertFetchedToUser(rawUser));
            })
            .catch(() => setUser(null));
    }, [authUser]);

    useEffect(() => {
        if (!isLoading && !authUser) {
            navigate('/login');
        }
    }, [authUser, isLoading, navigate]);

    if (isLoading) return <p>読み込み中...</p>;
    if (!authUser) return null;
    if (user === undefined) return <p>ユーザー情報取得中...</p>;
    if (user === null) return <p>ユーザー情報が取得できません。</p>;

    return (
        <BaseLayout>
            <CenterBarLayout header={<AppHeader />}>
                <CreatePostCenterBar
                    userName={user.user_name}
                    avatarImageUrl={user.user_image}
                />
            </CenterBarLayout>
        </BaseLayout>
    );
}
