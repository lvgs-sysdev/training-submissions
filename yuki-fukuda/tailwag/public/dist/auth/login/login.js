/**
 * ログイン画面を初期化する関数
 * @param containerId 描画先の要素ID（例: "root"）
 */
export const initLogin = async (containerId) => {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    try {
        // public/auth/login/login.htmlの読み込み
        const htmlResponse = await fetch("/auth/login/login.html");
        const html = await htmlResponse.text();
        container.innerHTML = html;
        //DOM要素を取得
        const loginForm = document.getElementById("login-form");
        const messageDiv = document.getElementById("message");
        if (!loginForm)
            return;
        //ログインボタンが押された時の処理
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const email = emailInput.value;
            const password = passwordInput.value;
            try {
                //バックエンドAPIにリクエストを飛ばす
                const apiResponse = await fetch("http://localhost:3000/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });
                const data = await apiResponse.json();
                if (apiResponse.ok) {
                    //トークンを保存
                    localStorage.setItem("token", data.token);
                    messageDiv.innerText = "ログイン成功!";
                    messageDiv.style.color = "green";
                    console.log("取得したトークン：", data.token);
                    //マイページへ偏移する処理などを将来的に記載
                }
                else {
                    messageDiv.innerText =
                        "エラー:" + (data.message || "ログインに失敗しました");
                    messageDiv.style.color = "red";
                }
            }
            catch (error) {
                console.error("通信エラー", error);
                messageDiv.innerText = "サーバーに接続できませんでした";
            }
        });
    }
    catch (error) {
        console.error("HTML読み込みエラー:", error);
    }
};
//# sourceMappingURL=login.js.map