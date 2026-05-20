import { router } from "../../EntryPoint.js";
import { registerTrafficControll } from "../../Services/users/registerTrafficControll.js";

export const initializeRegister_Button = async () => {
  const Register_Button = document.querySelector(".register_button");

  if (!Register_Button) {
    console.error("no such a button.");
    throw new Error("no such a button.");
  } else {
    console.log("initializeRegister_Button 登録ボタンクリックイベント検知前");
    Register_Button.addEventListener("click", async () => {
      try {
        console.log("フォームデータ取得前");
        const response = await registerTrafficControll();
        window.history.pushState({ page: "login" }, "", "/login");
        router();
        alert("新規登録に成功しました");
      } catch (error) {
        console.error("ユーザ情報を登録できませんでした");
        alert("ユーザ情報を登録できませんでした");
      }
    });
  }
};
