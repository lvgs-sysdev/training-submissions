const loginForm = document.getElementById("login-form");
const messageDiv = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      messageDiv.innerText = "ログイン成功!";
      console.log("取得したトークン:", data.token);
    } else {
      messageDiv.innerText = "エラー" + data.message;
    }
  } catch (error) {
    console.error("通信エラー", error);
    messageDiv.innerText = "サーバーに接続できませんでした";
  }
});
