const form = document.getElementById("login-form");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user_id = document.getElementById("user_id").value;
    const password = document.getElementById("password").value;
    
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            credentials: 'include', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, password })
        });
        
        const result = await response.json();

        if (response.ok) {
            message.textContent = 'ログイン成功！';
        } else {
            message.textContent = 'エラー: ' + result.error;
        }
    } catch (error) {
        console.error(error);
        message.textContent = 'サーバーに接続できませんでした';
    }
});