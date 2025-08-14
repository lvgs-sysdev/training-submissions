import styles from './Post.module.css';
import { Link } from 'react-router-dom';
import { CONFIG, ROUTES } from '../../constants';

type PostProps = {
    userName: string;
    userId: string;
    content: string;
    avatarImageUrl: string;
    imagePath: string;
};

export function Post({ userName, userId, content, avatarImageUrl, imagePath }: PostProps) {
    const htmlContent = content.replace(/__POST_IMAGE__/g, imagePath);

    return (
        <article className={styles.post}>
            <div className={styles.userImg}>
                <img
                    className={styles.profileAvatarImage}
                    src={`${CONFIG.API_BASE_URL}${avatarImageUrl}`}
                    alt={`${userName}のアバター`}
                />
            </div>
            <div className={styles.postBody}>
                <div className={styles.postHeader}>
                    <Link to={ROUTES.USER_PROFILE(userId)}>
                        <strong>{userName}</strong>
                        <span className={styles.userId}>@{userId}</span>
                    </Link>
                </div>
                <div
                    className={styles.postContent}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </div>
        </article>
    );
}
