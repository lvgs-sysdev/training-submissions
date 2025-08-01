// src/components/layouts/BaseLayout.tsx
import type { ReactNode } from 'react';
import { SideBarA } from '../SideBarA';
import { SideBarB } from '../SideBarB';
import { useRecommendedUsers } from '../../hooks/useRecommendedUsers';

type BaseLayoutProps = {
    children: ReactNode;
    showSideBars?: boolean;
    currentUserId?: string | null; // 現在のユーザーIDを除外するため
};

export function BaseLayout({ children, showSideBars = true, currentUserId }: BaseLayoutProps) {
    const { users: recommendedUsers, loading, error } = useRecommendedUsers(currentUserId, 5);

    if (!showSideBars) {
        return <main>{children}</main>;
    }

    return (
        <main>
            <SideBarA />
            {children}
            <SideBarB 
                users={recommendedUsers} 
                loading={loading} 
                error={error}
            />
        </main>
    );
}
