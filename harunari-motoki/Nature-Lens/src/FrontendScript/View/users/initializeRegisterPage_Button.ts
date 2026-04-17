import { router } from "../../EntryPoint.ts";

export const initializeRegisterPage_Button = () => {
  const registerPage_Button = document.querySelector(".registerPage_button");

  if (!registerPage_Button) {
    console.error("何かがおかしい");
    throw new Error("HTML Error");
  }
  console.log(
    "initializeRegisterPage_Button 新規登録画面クリックイベント検知前",
  );
  registerPage_Button.addEventListener("click", async () => {
    try {
      console.log("パス書き換え前");
      window.history.pushState({ page: "register" }, "", "/register");
      //新規登録画面に書き換え
      console.log("新規登録ページに書き換え前");
      router();
    } catch (error) {
      console.error("何かがおかしい");
      throw new Error("Page Refresh error");
    }
  });
};
