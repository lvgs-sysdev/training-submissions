const LoginBtn = document.querySelector(`#login-form`);

LoginBtn.addEventListener(`submit`, async (event) => {
  event.preventDefault();
  console.log("ログインボタンが押されました");

  const user_id = document.querySelector("#user_id").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, password }),

      credentials: "include",
    });

    const result = await response.json();

    if (response.ok) {
      alert("ログイン成功!トップページに移動します");
      const meRes = await fetch("http://localhost:3000/me", {
        credentials: "include",
      });
      const meData = await meRes.json();
      console.log("届いたデータ", meData);
      console.log("ログインしてる?:", meData.loggedIn);
      console.log("ユーザー名", meData.user?.user_name);
      window.location.href = "./top.page.html";
    } else {
      alert("IDまたはパスワードが正しくありません：" + result.message);
    }
    alert(result.message);
  } catch (err) {
    alert("ログイン中にエラーが発生しました。");
  }
});
