import { initRegister } from "../register/register.js";
import { validateEmail, validatePassword } from "../../utils/validation.js";
import { initTimeline } from "../../feed/timeline/timeline.js";

//APIレスポンスの型定義
interface LoginResponse {
  token: string;
  message?: string;
  user: { id: number };
}

/**
 * ログイン画面を初期化する関数
 * @param containerId 描画先の要素ID（例: "root"）
 */
export const initLogin = async (containerId: string): Promise<void> => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    // public/auth/login/login.htmlの読み込み
    const htmlResponse = await fetch("/auth/login/login.html");
    const html = await htmlResponse.text();
    container.innerHTML = html;

    //DOM要素を取得
    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    const messageDiv = document.getElementById("message") as HTMLDivElement;
    // 「新規登録へ」のリンクを取得
    const toRegisterLink = document.getElementById("to-register");

    if (!loginForm) return;

    // 新規登録リンクがクリックされた時の切り替え処理
    if (toRegisterLink) {
      toRegisterLink.addEventListener("click", (e: Event) => {
        e.preventDefault();
        initRegister(containerId); // 新規登録画面の初期化関数を呼ぶ
      });
    }

    //ログインボタンが押された時の処理

    loginForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();

      messageDiv.innerText = "";

      const email = (document.getElementById("email") as HTMLInputElement)
        .value;
      const password = (document.getElementById("password") as HTMLInputElement)
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

        const data: LoginResponse = await apiResponse.json();

        if (apiResponse.ok) {
          //トークンを保存
          localStorage.setItem("token", data.token);
          messageDiv.innerText = "ログイン成功!";
          messageDiv.style.color = "green";
          console.log("取得したトークン：", data.token);
          localStorage.setItem("userId", String(data.user.id));
          initTimeline("root");
        } else {
          messageDiv.innerText =
            "エラー:" + (data.message || "ログインに失敗しました");
          messageDiv.style.color = "red";
        }
      } catch (error) {
        console.error("通信エラー", error);
        messageDiv.innerText = "サーバーに接続できませんでした";
      }
    });
  } catch (error) {
    console.error("HTML読み込みエラー:", error);
  }
};
