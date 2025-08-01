import { useParams, useNavigate, } from 'react-router-dom';

import { BaseLayout } from '../components/layouts/BaseLayout';
import { CenterBarLayout } from '../components/layouts/CenterBarLayout';
import { AppHeader } from '../components/common/AppHeader';
import { UserProfileHeader } from '../components/UserProfileHeader';
import { Post } from '../components/Post';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks/useUser';
import { usePosts } from '../hooks/usePosts';
import { ROUTES, UI_MESSAGES } from '../constants';

export function UserProfilePage() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const { user: authUser } = useAuth();

    const { user, loading: userLoading, error: userError } = useUser(userId);
    const { posts, loading: postsLoading } = usePosts({ userId });

    if (userError && !userLoading) {
        navigate(ROUTES.NOT_FOUND);
        return null;
    }

    if (userLoading) return <LoadingSpinner message={UI_MESSAGES.LOADING} />;
    if (!user) return null;

    return (
        <BaseLayout>
            <CenterBarLayout
                header={
                    <AppHeader/>
                }
            >
                <UserProfileHeader
                    userName={user.user_name}
                    userId={user.account_id}
                    bio={user.bio}
                    bannerImageUrl={user.banner_image}
                    avatarImageUrl={user.user_image}
                    isOwnPage={authUser?.account_id === user.account_id}
                />

                <div id="postTitle">
                    <h2 className="postTitleContent">このユーザーの投稿</h2>
                </div>

                <div id="allPosts">
                    {postsLoading ? (
                        <LoadingSpinner message={UI_MESSAGES.LOADING} />
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <Post
                                key={post.post_id}
                                userName={post.user_name}
                                userId={post.userId}
                                content={post.content}
                                avatarImageUrl={post.avatarImageUrl}
                                imagePath={post.imagePath}
                            />
                        ))
                    ) : (
                        <EmptyState
                            icon="📝"
                            title={UI_MESSAGES.POST_NOT_FOUND}
                            description="このユーザーはまだ投稿していません"
                        />
                    )}
                </div>
            </CenterBarLayout>
        </BaseLayout>
    );
}
