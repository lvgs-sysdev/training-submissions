const loginForm = document.getElementById('login-form');
const messageDiv = document.getElementById('message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.token);
            alert('ログインに成功しました')
            window.location.href = '/profile.html';
        } else {
            messageDiv.textContent = result.message;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        messageDiv.textContent = 'ログイン処理中にエラーが発生しました';
        messageDiv.style.color = 'red';
    }
});