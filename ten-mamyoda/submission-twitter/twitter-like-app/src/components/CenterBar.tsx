// src/components/CenterBar.tsx
import { Post } from './Post';
import { LoadingState } from './common/LoadingState';
import { EmptyState } from './common/EmptyState';
import { usePosts } from '../hooks/usePosts';
import { ROUTES, UI_MESSAGES } from '../constants';

export function CenterBar() {
    const { posts, loading, error } = usePosts();

    return (
        <div id="allPosts">
            <LoadingState isLoading={loading} error={error}>
                {posts.length > 0 ? (
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
                        description="最初の投稿をしてみましょう！"
                        actionText="投稿する"
                        onAction={() => window.location.href = ROUTES.CREATE_POST}
                    />
                )}
            </LoadingState>
        </div>
    );
}
