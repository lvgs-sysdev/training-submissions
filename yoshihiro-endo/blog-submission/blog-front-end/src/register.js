const API_URL = import.meta.env.VITE_API_URL;

const formElement = document.getElementById('register-form');

formElement.addEventListener('submit', async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ

    const form = e.target;
    const username = form.username.value;
    const user_id = form.user_id.value;
    const password = form.password.value;
    const messageEl = document.getElementById('message');

    messageEl.textContent = ''; // メッセージをリセット

    try {
        const response = await fetch(`${API_URL}/register`, { // バックエンドのエンドポイント
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, user_id, password }),
        });

        const data = await response.json();

        if (response.ok) { // HTTPステータス 200-299
            messageEl.textContent = data.message || '登録が完了しました！';
            messageEl.className = 'success';
            form.reset(); // フォームをリセット
        } else {
            // サーバーからのエラーメッセージを表示
            messageEl.textContent = data.message || '登録に失敗しました。';
            messageEl.className = 'error';
        }
    } catch (error) {
        console.error('登録エラー:', error);
        messageEl.textContent = '通信エラーが発生しました。';
        messageEl.className = 'error';
    }
});