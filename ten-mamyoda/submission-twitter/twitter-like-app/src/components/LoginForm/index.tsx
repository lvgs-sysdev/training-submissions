import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { useAuth } from '../../context/AuthContext';

export function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    // ここでエラーメッセージを管理
    const [userIdError, setUserIdError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // まずはエラーをリセット
        setUserIdError('');
        setPasswordError('');
        setGeneralError('');

        let hasError = false;

        // 簡単な入力チェック（必要なら拡張可能）
        if (!userId.trim()) {
            setUserIdError('ユーザーIDは必須です。');
            hasError = true;
        }
        if (!password) {
            setPasswordError('パスワードは必須です。');
            hasError = true;
        }

        if (hasError) return;

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    accountId: userId,
                    password: password,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                // 失敗時は汎用エラーとしてセット（バックエンドのメッセージを表示）
                setGeneralError(data.message || 'ログインに失敗しました。');
                return;
            }

            login(data.user);
            navigate('/');

        } catch (error: any) {
            console.error('ログイン処理中にエラーが発生しました:', error);
            setGeneralError('通信エラーが発生しました。再度お試しください。');
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
                    {/* 全体のエラー表示 */}
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
                        If you don't have an account, click <Link to="/register" className={styles.here}>here.</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
