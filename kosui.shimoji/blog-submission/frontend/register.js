
const form = document.getElementById("register-form");
const messege=document.getElementById("messege");


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user_id = document.getElementById("user_id").value;
    const user_name = document.getElementById("user_name").value;
    const password = document.getElementById("password").value;


 try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, user_name, password })
    })

    const result = await response.json()


    if (response.ok) {
      message.textContent = '登録が完了しました！'
    } else {
      message.textContent = 'エラー: ' + result.error
    }
  } catch (error) {
    // ⑧ 通信そのものが失敗したとき（サーバーが起動していない等）
    console.error(error)
    message.textContent = 'サーバーに接続できませんでした'
  }
})