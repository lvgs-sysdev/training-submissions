import styles from './UserProfileHeader.module.css';
import { Link } from 'react-router-dom';

type Props = {
    userName: string;
    userId: string;
    bio?: string;
    bannerImageUrl?: string;
    avatarImageUrl: string;
    isOwnPage: boolean;
};

export function UserProfileHeader({
    userName,
    userId,
    bio,
    bannerImageUrl,
    avatarImageUrl,
    isOwnPage,
}: Props) {
    return (
        <div className={styles.profileHeader}>
            <div
                className={styles.profileBanner}
                style={{ backgroundImage: `url(http://localhost:3000${bannerImageUrl})` }}
            ></div>
            <div className={styles.profileContent}>
                <div className={styles.profileTopRow}>
                    <div className={styles.profileAvatarWrapper}>
                        <img
                            className={styles.profileAvatarImage}
                            src={`http://localhost:3000${avatarImageUrl}`}
                            alt={`${userName}のアバター`}
                        />
                    </div>
                    {isOwnPage && (
                        <Link to="/profile/edit" className={styles.profileEditButton}>
                            プロフィールを編集
                        </Link>
                    )}
                </div>
                <div className={styles.profileDetails}>
                    <h2 className={styles.profileName}>{userName}</h2>
                    <span className={styles.profileHandle}>@{userId}</span>
                </div>
                <p className={styles.profileBio}>{bio}</p>
            </div>
        </div>
    );
}

