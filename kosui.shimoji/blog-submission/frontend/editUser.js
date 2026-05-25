const form = document.getElementById("edit-user-form");
const message = document.getElementById("message");
const userIdInput = document.getElementById("user_id");
const userNameInput = document.getElementById("user_name");

async function loadProfile() {
  try {
    const response = await fetch('http://localhost:3000/me', {
      credentials: 'include'      
    })

    if (!response.ok) {
        message.textContent = 'ログインしてください';
        return
    }

    const result = await response.json();
    userIdInput.value = result.data.user_id     
    userNameInput.value = result.data.user_name 
} catch (error) {
    console.error(error)
    message.textContent = 'サーバーに接続できませんでした'
  }
}


form.addEventListener("submit", async (event) => {
    event.preventDefault();

  const user_id = userIdInput.value
  const user_name = userNameInput.value

  try {
    const response = await fetch('http://localhost:3000/users/' + user_id, {
    method: 'PUT',
    credentials: 'include',      
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_name })
    })

    const result = await response.json()

    if (response.ok) {
    message.textContent = 'プロフィールを更新しました'
    } else {
    message.textContent = 'エラー: ' + result.error
    }
} catch (error) {
    console.error(error)
    message.textContent = 'サーバーに接続できませんでした'
}
})

// ③ ページを開いたら、まず初期表示を実行
loadProfile()
