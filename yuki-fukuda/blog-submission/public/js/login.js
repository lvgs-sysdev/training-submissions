const LoginBtn = document.querySelector(`#login-form`);

LoginBtn.addEventListener(`submit` , async (event) => {
    event.preventDefault();
    console.log("ログインボタンが押されました");

    const user_id = document.querySelector('#user_id').value;
    const password = document.querySelector('#password').value;

    try{
        const response = await fetch('http://localhost:3000/login' ,{
            method: 'POST' ,
            headers: {
                'Content-Type': 'application/json' },
                body: JSON.stringify({user_id, password})
         });

         const result = await response.json();
         alert(result.message);

    } catch (err) {
        alert('登録中にエラーが発生しました。');
    }
});
