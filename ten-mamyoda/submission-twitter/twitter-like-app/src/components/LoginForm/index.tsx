import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS, ROUTES, UI_MESSAGES } from '../../constants';

export function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    // エラーメッセージ管理
    const [userIdError, setUserIdError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setUserIdError('');
        setPasswordError('');
        setGeneralError('');

        let hasError = false;

        if (!userId.trim()) {
            setUserIdError('ユーザーIDは必須です。'); // UI_MESSAGES に追加可能
            hasError = true;
        }
        if (!password) {
            setPasswordError('パスワードは必須です。'); // UI_MESSAGES に追加可能
            hasError = true;
        }

        if (hasError) return;

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ accountId: userId, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setGeneralError(data.message || UI_MESSAGES.GENERAL_ERROR);
                return;
            }

            login(data.user);
            navigate(ROUTES.HOME);

        } catch (error: any) {
            console.error('ログイン処理中にエラーが発生しました:', error);
            setGeneralError(UI_MESSAGES.NETWORK_ERROR);
        }
    };

    return (
        <div className={styles.loginInputBar}>
            <div className={styles.inputForm}>
                <h2 className={styles.inputHeadline}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputBox}>
                        <ul className={styles.userInfo}>
                            <li className={styles.itemName}>
                                <span className={styles.item}>User ID</span>
                                <input
                                    type="text"
                                    name="userId"
                                    className={styles.input}
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                                {userIdError && <p style={{ color: 'red', marginTop: '4px' }}>{userIdError}</p>}
                            </li>
                            <li className={styles.itemName}>
                                <span className={styles.item}>Password</span>
                                <input
                                    type="password"
                                    name="password"
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {passwordError && <p style={{ color: 'red', marginTop: '4px' }}>{passwordError}</p>}
                            </li>
                        </ul>
                    </div>
                    {generalError && (
                        <p style={{ color: 'red', marginTop: '8px', textAlign: 'center' }}>
                            {generalError}
                        </p>
                    )}
                    <div className={styles.loginBox}>
                        <button type="submit" className={styles.loginButton}>login</button>
                    </div>
                </form>
                <div className={styles.goRegist}>
                    <hr />
                    <p className={styles.announce}>
                        If you don't have an account, click <Link to={ROUTES.REGISTER} className={styles.here}>here.</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
