const loginForm = document.getElementById('loginForm');
const errorMessageDiv = document.getElementById('error-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // デフォルトのフォーム送信をキャンセル

    const userID = loginForm.userID.value;
    const password = loginForm.password.value;

    errorMessageDiv.textContent = ''; // 前回のエラーメッセージをクリア

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID, password })
        });

        if (response.ok) { // ステータスコードが200番台の場合
            window.location.href = '/home'; // ログイン成功時にホームへリダイレクト
        } else {
            const errorData = await response.json();
            errorMessageDiv.textContent = errorData.error; // エラーメッセージを表示
        }
    } catch (error) {
        console.error('Fetch error:', error);
        errorMessageDiv.textContent = 'ネットワークエラーが発生しました。再度お試しください。';
    }
});