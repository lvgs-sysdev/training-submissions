// src/components/SideBarB/index.tsx
import { Link } from 'react-router-dom';
import styles from './SideBarB.module.css';
import type { RecommendedUser } from '../../types/user';
import { CONFIG, UI_MESSAGES } from '../../constants';

type SideBarBProps = {
    users?: RecommendedUser[];
    loading?: boolean;
    error?: string | null;
};

export function SideBarB({ users = [], loading = false, error }: SideBarBProps) {
    return (
        <div className={styles.sideBarB}>
            <nav className={styles.randomUser}>
                <ul className={styles.userList}>
                    <p className={styles.userContent}>おすすめユーザー</p>
                    
                    {loading && (
                        <li style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
                            {UI_MESSAGES.LOADING}
                        </li>
                    )}
                    
                    {error && (
                        <li style={{ padding: '1rem', textAlign: 'center', color: '#ff6b6b' }}>
                            {UI_MESSAGES.GENERAL_ERROR}
                        </li>
                    )}
                    
                    {!loading && !error && users.length === 0 && (
                        <li style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
                            {UI_MESSAGES.USER_NOT_FOUND}
                        </li>
                    )}

                    {!loading && !error && users.length > 0 && users.map(user => {
                        console.log('Recommended user:', user); // ← ここでユーザー情報確認
                        return (
                            <li className={styles.userInfo} key={user.id}>
                                <Link to={`/user/${user.userId}`}>
                                    <div className={styles.userImg}>
                                        <img
                                            className={styles.userImg}
                                            src={user.imageUrl ? `${user.imageUrl}` : CONFIG.DEFAULT_AVATAR_URL}
                                            alt={`${user.name}のアバター`}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = CONFIG.DEFAULT_AVATAR_URL;
                                            }}
                                        />
                                    </div>
                                    <div className={styles.userNameAndId}>
                                        <strong>{user.name}</strong>
                                        <span className={styles.userId}>@{user.userId}</span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
