const registerForm = document.getElementById('register-form');
const messageDiv = document.getElementById('message');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('新規登録が完了しました！ログインしてください')
            window.location.href = '/login.html'
        } else {
            messageDiv.textContent = result.message;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        messageDiv.textContent = '登録中にエラーが発生しました';
        messageDiv.style.color = 'red';
    }
});