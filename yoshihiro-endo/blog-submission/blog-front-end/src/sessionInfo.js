const API_URL = import.meta.env.VITE_API_URL;

export async function checkLoginStatus() {
    try {
        // fetchは自動的にCookieを送信します (credentials: 'same-origin' がデフォルト)
        const response = await fetch(`${API_URL}/user`, {
            credentials: 'include'
        });

        if (response.ok) {
            const user = await response.json();
            console.log(user);
            return user;
        } else {
            console.log('ログインしていません');
            const user = {user_id: 'null'}
            return user;
        }
    } catch (err) {
        console.error('ログイン状態の確認エラー:', err);
        errorMessage.textContent = 'サーバーに接続できません。';
    }
}