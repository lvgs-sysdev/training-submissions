import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import styles from './CreatePostCenterBar.module.css';
import { Post } from '../Post';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { usePosts } from '../../hooks/usePosts';
import { ROUTES, UI_MESSAGES } from '../../constants';
import MyUploadAdapterPlugin from '../../utils/MyUploadAdapterPlugin';

type Props = {
    userName: string;
    avatarImageUrl: string;
};

export function CreatePostCenterBar({ userName, avatarImageUrl }: Props) {
    const [content, setContent] = useState('');
    const [postImageUrl, setPostImageUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { posts, loading, createPost } = usePosts();

    // MyUploadAdapterPluginに画像アップロード成功時のコールバックを渡して画像URLを受け取る
    function myUploadAdapterPlugin(editor: any) {
        MyUploadAdapterPlugin(editor, (uploadedUrl: string) => {
            // 画像アップロード成功時に呼ばれる。URLを状態にセット
            setPostImageUrl(uploadedUrl);
        });
    }

    // 投稿ボタンの活性/非活性判定
    const isPostButtonDisabled = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        return tempDiv.innerText.trim() === '' || isSubmitting;
    };

    // フォーム送信処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const result = await createPost(content, postImageUrl || undefined);
            
            if (result.success) {
                alert(UI_MESSAGES.POST_CREATED);
                setContent('');
                setPostImageUrl(null);
            } else {
                alert(result.error || UI_MESSAGES.POST_ERROR);
            }
        } catch (err) {
            console.error('投稿エラー', err);
            alert(UI_MESSAGES.POST_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    const editorConfiguration = {
        extraPlugins: [myUploadAdapterPlugin],
        removePlugins: [
            'CKBox', 'CKFinder', 'EasyImage', 'RealTimeCollaborativeComments',
            'RealTimeCollaborativeTrackChanges', 'RealTimeCollaborativeRevisionHistory',
            'PresenceList', 'Comments', 'TrackChanges', 'TrackChangesData',
            'RevisionHistory', 'Pagination', 'WProofreader', 'ExportPdf', 'ExportWord',
        ],
        toolbar: [
            '|', 'bold', 'italic', 'link',
            '|', 'imageUpload', 'insertTable', 'mediaEmbed', 'blockQuote',
            '|', 'undo', 'redo',
        ],
        placeholder: 'いまどうしてる？',
    };

    return (
        <div className={styles.createPostBar}>
            <header>
                <div id="headerBox">
                    <div className={styles.headerActions}>
                        <Link to={ROUTES.HOME} className={styles.cancelButton}>キャンセル</Link>
                    </div>
                    <div className={`${styles.headerActions} ${styles.right}`}>
                        <button
                            type="submit"
                            form="createPostForm"
                            className="postButton"
                            disabled={isPostButtonDisabled()}
                        >
                            吐き出す
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.scrollableContent}>
                <div className={`${styles.postFormContainer} ${styles.ckEditorContainer}`}>
                    <form id="createPostForm" onSubmit={handleSubmit}>
                        <div className={styles.postInputGroup}>
                            <div className={styles.profileAvatarWrapper}>
                                <img
                                    className={styles.profileAvatarImage}
                                    src={`http://localhost:3000${avatarImageUrl}`}
                                    alt={`${userName}のアバター`}
                                />
                            </div>
                            <div className={styles.composerBody}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfiguration}
                                    data={content}
                                    onChange={(_event, editor) => setContent(editor.getData())}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div>
                    <h3 className={styles.timelineHeadline}>みんなの愚痴</h3>
                    {loading ? (
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
                            description="最初の投稿をしてみましょう！"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
