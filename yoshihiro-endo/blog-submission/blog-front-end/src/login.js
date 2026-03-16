import './common-settings.css'
import './detail-page.css'

const API_URL = import.meta.env.VITE_API_URL;

const loginFormMain = document.getElementById('login-form-main');
const errorMessage = document.getElementById('error-message');
const logoutButton = document.getElementById('logout-button');
const userInfo = document.getElementById('logged-in-user');
const userPhoto = document.getElementById('user-photo');
const userName = document.getElementById('user-name');
const headerUserInfo = document.getElementById('header-user-info');
const loginForm = document.getElementById('login-form');

/**
 * API (2): ログイン処理 (POST /login)
 * ログインフォームのSubmitイベント
 */

loginFormMain.addEventListener('submit', async (event) => {
    event.preventDefault(); // フォームのデフォルト送信をキャンセル
    errorMessage.textContent = ''; // エラーメッセージをクリア

    // フォームからデータを取得
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                // 送信するデータがJSON形式であることをサーバーに伝える
                'Content-Type': 'application/json',
            },
            // JavaScriptオブジェクトをJSON文字列に変換して送信
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            // ログイン成功
            console.log('ログイン成功:', data.user);
            updateHeaderUI(data.user);
        } else {
            // ログイン失敗 (400, 401 など)
            console.warn('ログイン失敗:', data.message);
            errorMessage.textContent = data.message || 'ログインに失敗しました。';
            updateHeaderUI(null);
        }
    } catch (err) {
        console.error('ログインリクエストエラー:', err);
        errorMessage.textContent = 'ログインリクエスト中にエラーが発生しました。';
    }
});

function updateHeaderUI(user) {
    if (user) {
        // ログイン状態
        userName.textContent = user.username;
        userPhoto.src = user.photoUrl;
        
        // headerUserInfo から 'hidden' を削除して表示
        headerUserInfo.classList.remove('hidden');
        // loginForm に 'hidden' を追加して非表示
        loginForm.classList.add('hidden');

        errorMessage.textContent = '';
    } else {

        // headerUserInfo に 'hidden' を追加して非表示
        headerUserInfo.classList.add('hidden');
        // loginForm から 'hidden' を削除して表示
        loginForm.classList.remove('hidden');

    }
}

async function checkLoginStatus() {
    try {
        // fetchは自動的にCookieを送信します (credentials: 'same-origin' がデフォルト)
        const response = await fetch(`${API_URL}/user`, {
            credentials: 'include'
        });

        if (response.ok) {
            // ログイン済み (200 OK)
            const user = await response.json();
            updateHeaderUI(user);
        } else {
            // 未ログイン (401 Unauthorized など)
            console.log('ログインしていません');
            updateHeaderUI(null);
        }
    } catch (err) {
        console.error('ログイン状態の確認エラー:', err);
        updateHeaderUI(null);
        errorMessage.textContent = 'サーバーに接続できません。';
    }
}
/**
 * API (3): ログアウト処理 (POST /logout)
 * ログアウトボタンのClickイベント
 */
logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            // ログアウト成功
            console.log('ログアウト成功:', data.message);
            updateHeaderUI(null); // UIを未ログイン状態に戻す
            loginFormMain.reset();
        } else {
            // ログアウト失敗（ほぼないが）
            console.warn('ログアウト失敗:', data.message);
            errorMessage.textContent = data.message || 'ログアウトに失敗しました。';
        }
    } catch (err) {
        console.error('ログアウトリクエストエラー:', err);
        errorMessage.textContent = 'ログアウトリクエスト中にエラーが発生しました。';
    }
});


// export用に変数を定義
const user = checkLoginStatus();
export const user_id = user.user_id;

// --- ページ読み込み時に実行 ---
checkLoginStatus();