import { initRegister } from "../register/register.js";
import { validateEmail, validatePassword } from "../../utils/validation.js";
import { initTimeline } from "../../feed/timeline/timeline.js";
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
        // 「新規登録へ」のリンクを取得
        const toRegisterLink = document.getElementById("to-register");
        if (!loginForm)
            return;
        // 新規登録リンクがクリックされた時の切り替え処理
        if (toRegisterLink) {
            toRegisterLink.addEventListener("click", (e) => {
                e.preventDefault();
                initRegister(containerId); // 新規登録画面の初期化関数を呼ぶ
            });
        }
        //ログインボタンが押された時の処理
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            messageDiv.innerText = "";
            const email = document.getElementById("email")
                .value;
            const password = document.getElementById("password")
                .value;
            //バリデーションチェック
            const results = [validateEmail(email), validatePassword(password)];
            const errorResult = results.find((r) => !r.isValid);
            if (errorResult) {
                messageDiv.innerText = errorResult.message;
                messageDiv.style.color = "orange";
                return;
            }
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
                    localStorage.setItem("userId", String(data.user.id));
                    initTimeline("root");
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