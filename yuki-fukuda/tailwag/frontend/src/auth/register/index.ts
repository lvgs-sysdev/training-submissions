import { RegisterForm } from "./register";
import { initLogin } from "../login/index"; // 登録成功後にログインへ戻すため

export const initRegister = (containerId: string): void => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const formElement = RegisterForm(containerId);
  container.appendChild(formElement);

  // --- ここから登録処理を追加 ---
  const registerForm = document.getElementById(
    "register-form",
  ) as HTMLFormElement;
  const messageDiv = document.getElementById("message") as HTMLDivElement;

  if (registerForm) {
    registerForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();

      // フォームの入力値を取得
      const formData = new FormData(registerForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        // バックエンドの新規登録APIに送信
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          messageDiv.innerText = "登録が完了しました！ログインしてください。";
          messageDiv.style.color = "green";

          // 2秒後にログイン画面へ自動で戻る
          setTimeout(() => {
            initLogin(containerId);
          }, 2000);
        } else {
          messageDiv.innerText =
            "エラー: " + (data.message || "登録に失敗しました");
          messageDiv.style.color = "red";
        }
      } catch (error) {
        console.error("通信エラー:", error);
        messageDiv.innerText = "サーバーに接続できませんでした";
      }
    });
  }
  // --- ここまで ---

  console.log("TSXの描画とイベント登録に成功しました!");
};
