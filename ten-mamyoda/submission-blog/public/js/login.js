const loginForm = document.getElementById('loginForm');
const errorMessageDiv = document.getElementById('error-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // デフォルトのフォーム送信をキャンセル

    const userID = loginForm.userID.value;
    const password = loginForm.password.value;

    errorMessageDiv.textContent = ''; // 前回のエラーメッセージをクリア

    const controller = new AbortController();
    const signal = controller.signal;

    // タイムアウト
    const timeoutId = setTimeout(() => {
        controller.abort(); // リクエストを中止
    }, 5000); // 5000ミリ秒 = 5秒

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID, password }),
            signal: signal //
        });

        // 応答が正常に返ってきたらタイムアウトを解除
        clearTimeout(timeoutId);

        if (response.ok) { // ステータスコードが200番台の場合
            window.location.href = '/home'; // ログイン成功時にホームへリダイレクト
        } else {
            const errorData = await response.json();
            errorMessageDiv.textContent = errorData.error; // エラーメッセージを表示
        }
    } catch (error) {
        // タイムアウトによる中止
        if (error.name === 'AbortError') {
            errorMessageDiv.textContent = 'サーバーからの応答がありません。時間をおいて再度お試しください。';
        } else {
            console.error('Fetch error:', error);
            errorMessageDiv.textContent = 'ネットワークエラーが発生しました。再度お試しください。';
        }
    } finally {
        // エラーが発生しなかった場合も、念のためタイマーをクリア
        clearTimeout(timeoutId);
    }
});