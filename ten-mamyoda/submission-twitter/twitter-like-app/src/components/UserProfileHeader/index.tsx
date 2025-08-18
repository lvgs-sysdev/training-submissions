import styles from './UserProfileHeader.module.css';
import { Link } from 'react-router-dom';
import { CONFIG, ROUTES } from '../../constants';

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
    const bannerUrl = bannerImageUrl
        ? `${bannerImageUrl}`
        : CONFIG.DEFAULT_BANNER_URL;

    const avatarUrl = avatarImageUrl
        ? `${avatarImageUrl}`
        : CONFIG.DEFAULT_AVATAR_URL;

    return (
        <div className={styles.profileHeader}>
            <div
                className={styles.profileBanner}
                style={{ backgroundImage: `url(${bannerUrl})` }}
            ></div>
            <div className={styles.profileContent}>
                <div className={styles.profileTopRow}>
                    <div className={styles.profileAvatarWrapper}>
                        <img
                            className={styles.profileAvatarImage}
                            src={avatarUrl}
                            alt={`${userName}のアバター`}
                        />
                    </div>
                    {isOwnPage && (
                        <Link to={ROUTES.EDIT_PROFILE} className={styles.profileEditButton}>
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
