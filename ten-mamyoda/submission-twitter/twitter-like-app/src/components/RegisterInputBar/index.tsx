import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './RegisterInputBar.module.css';
import { API_ENDPOINTS, ROUTES, UI_MESSAGES } from '../../constants';

export function RegisterInputBar() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [userNameError, setUserNameError] = useState('');
    const [userIdError, setUserIdError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // ユーザーID重複チェック
    const checkDuplicateUserId = async (userId: string): Promise<boolean> => {
        try {
            const response = await axios.post(API_ENDPOINTS.USER_CHECK_DUPLICATE, { userId });
            return response.data.isAvailable;
        } catch (error) {
            console.error('重複チェック中にエラー:', error);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setUserNameError('');
        setUserIdError('');
        setPasswordError('');
        setConfirmPasswordError('');

        let hasError = false;

        if (!userName.trim()) {
            setUserNameError('名前は必須です。'); // UI_MESSAGES に追加可能
            hasError = true;
        }
        if (!userId.trim()) {
            setUserIdError('ユーザーIDは必須です。'); // UI_MESSAGES に追加可能
            hasError = true;
        }

        const uppercaseRegex = /[A-Z]/;
        if (!uppercaseRegex.test(password)) {
            setPasswordError('パスワードには少なくとも1つの大文字が必要です。'); // UI_MESSAGES に追加可能
            hasError = true;
        }

        if (!password) {
            setPasswordError('パスワードは必須です。'); // UI_MESSAGES に追加可能
            hasError = true;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('パスワードが一致しません。'); // UI_MESSAGES に追加可能
            hasError = true;
        }

        if (hasError) return;

        const isAvailable = await checkDuplicateUserId(userId);
        if (!isAvailable) {
            setUserIdError(UI_MESSAGES.DUPLICATE_USER_ID);
            return;
        }

        try {
            await axios.post(API_ENDPOINTS.REGISTER, {
                accountId: userId,
                userName,
                password,
            });

            alert(UI_MESSAGES.POST_CREATED); // 登録完了メッセージとして代用
            navigate(ROUTES.LOGIN);
        } catch (error: any) {
            console.error('登録処理中にエラーが発生しました:', error);
            alert(error.response?.data?.message || UI_MESSAGES.GENERAL_ERROR);
        }
    };

    return (
        <div className={styles.registerInputBar}>
            <div className={styles.inputForm}>
                <h2 className={styles.inputHeadline}>New Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputBox}>
                        <ul className={styles.userInfo}>
                            <li className={styles.itemName}>
                                <span className={styles.item}>Name</span>
                                <input
                                    type="text"
                                    name="userName"
                                    className={styles.input}
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                                {userNameError && <p style={{ color: 'red', marginTop: '4px' }}>{userNameError}</p>}
                            </li>
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
                            <li className={styles.itemName}>
                                <span className={styles.item}>Confirm Password</span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className={styles.input}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {confirmPasswordError && <p style={{ color: 'red', marginTop: '4px' }}>{confirmPasswordError}</p>}
                            </li>
                        </ul>
                    </div>
                    <div className={styles.registerBox}>
                        <button type="submit" className={styles.registButton}>register</button>
                    </div>
                </form>
                <div className={styles.goLogin}>
                    <hr />
                    <p className={styles.announce}>
                        If you have an account, click <Link to={ROUTES.LOGIN} className={styles.here}>here.</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
