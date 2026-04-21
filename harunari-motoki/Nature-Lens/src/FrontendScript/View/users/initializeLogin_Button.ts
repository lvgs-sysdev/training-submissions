import { authService } from "../../Services/users/authService.ts";
import { router } from "../../EntryPoint.ts";
import { loginTrafficControll } from "../../Services/users/loginTrafficControll.ts";

export const initializeLogin_Button = async () => {
  const login_Button = document.querySelector(".login_button");

  if (!login_Button) {
    console.error("no such a button.");
    throw new Error("no such a button.");
  } else {
    console.log("initializelogin_Button 登録ボタンクリックイベント検知前");
    login_Button.addEventListener("click", async () => {
      try {
        console.log("フォームデータ取得前");
        const response = await loginTrafficControll();
        console.log(
          "initializelogin_Button　サーバから帰ってきたデータの中身　statusが入っているはず",
          response,
        );
        console.log("レスポンスのトークンを取り出す", response.status);
        if (response.status === "success") {
          const { accessToken } = response.token;
          authService.setAccessToken(accessToken);
          window.history.pushState({ page: "scan" }, "", "/scan");
          router();
          alert("ログイン成功！　楽しんで！");
        } else {
          console.log("initializeLogin_Buttonのfailureに到達");
          window.history.pushState({ page: "login" }, "", "/login");
          router();
          alert(
            "ログインできませんでした　ユーザIDとパスワードを確認して再度実行してください",
          );
        }
      } catch (error) {
        console.error("ログインできませんでした");
        alert(
          "ログインできませんでした　ユーザIDとパスワードを確認して再度実行してください",
        );
      }
    });
  }
};
