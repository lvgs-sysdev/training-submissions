import { initLogin } from "../login/login.js";
import { validateEmail, validatePassword, validateAccountId, validateAccountName, } from "../../utils/validation.js";
export const initRegister = async (containerId) => {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    const response = await fetch("/auth/register/register.html");
    const html = await response.text();
    container.innerHTML = html;
    const registerForm = document.getElementById("register-form");
    const messageDiv = document.getElementById("message");
    // 「ログインはこちら」リンクを取得
    const toLoginLink = document.getElementById("to-login");
    // クリック時の切り替え処理
    if (toLoginLink) {
        toLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            initLogin(containerId); // ログイン画面の関数を呼び出す
        });
    }
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        messageDiv.innerText = "";
        const account_id = document.getElementById("account_id").value;
        const account_name = document.getElementById("account_name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password")
            .value;
        //バリデーションチェック
        const results = [
            validateAccountId(account_id),
            validateAccountName(account_name),
            validateEmail(email),
            validatePassword(password),
        ];
        const errorResult = results.find((result) => !result.isValid);
        if (errorResult) {
            messageDiv.innerText = errorResult.message;
            messageDiv.style.color = "orange";
            return;
        }
        try {
            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ account_id, account_name, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                messageDiv.innerText = "登録成功！ログインしてください。";
                messageDiv.style.color = "blue";
            }
            else {
                messageDiv.innerText = "エラー" + data.message;
                messageDiv.style.color = "red";
            }
        }
        catch (error) {
            messageDiv.innerText = "サーバーに接続できませんでした";
        }
    });
};
//# sourceMappingURL=register.js.map