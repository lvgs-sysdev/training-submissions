import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SideBarA.module.css';

export function SideBarA() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (isLoading) {
        return <div id="sideBarA"></div>;
    }

    const backendUrl = 'http://localhost:3000';

    return (
        <div className={styles.sideBarA}>
            <nav className={styles.allPage}>
                <ul className={styles.pageList}>
                    <li className={styles.pages}><Link to="/">Home</Link></li>

                    {user ? (
                        <>
                            <li className={styles.profileLink}>
                                <Link to={`/user/${user.account_id}`}>
                                    <div
                                        className={styles.userImg}
                                        style={{
                                            backgroundImage: `url(${backendUrl}${user.user_image || '/images/default-avatar.png'})`,
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
                            <li className={styles.pages}><Link to="/login">Login</Link></li>
                            <li className={styles.pages}><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
}
