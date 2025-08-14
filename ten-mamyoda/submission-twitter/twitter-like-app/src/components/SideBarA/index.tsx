import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SideBarA.module.css';
import { CONFIG, ROUTES } from '../../constants';

export function SideBarA() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.HOME);
    };

    if (isLoading) {
        return <div id="sideBarA"></div>;
    }

    return (
        <div className={styles.sideBarA}>
            <nav className={styles.allPage}>
                <ul className={styles.pageList}>
                    <li className={styles.pages}>
                        <Link to={ROUTES.HOME}>Home</Link>
                    </li>

                    {user ? (
                        <>
                            <li className={styles.profileLink}>
                                <Link to={ROUTES.USER_PROFILE(user.account_id)}>
                                    <div
                                        className={styles.userImg}
                                        style={{
                                            backgroundImage: `url(${CONFIG.API_BASE_URL}${user.user_image || CONFIG.DEFAULT_AVATAR_URL})`,
                                        }}
                                    ></div>
                                    <div className={styles.userNameAndId}>
                                        <strong>{user.user_name}</strong>
                                        <span className={styles.userId}>@{user.account_id}</span>
                                    </div>
                                </Link>
                            </li>
                            <li className={styles.pages}>
                                <button onClick={handleLogout} className={styles.navButton}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={styles.pages}><Link to={ROUTES.LOGIN}>Login</Link></li>
                            <li className={styles.pages}><Link to={ROUTES.REGISTER}>Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
}
