import { router } from "../../EntryPoint.ts";

export const initializeLoginPage_Button = async () => {
  const loginPage_Button = document.querySelector(".loginPage_button");

  if (!loginPage_Button) {
    console.error("initializeloginPage_Button　何かがおかしい");
    throw new Error("HTML Error");
  }
  console.log("initializeloginPage_Button 新規登録画面クリックイベント検知前");
  loginPage_Button.addEventListener("click", async () => {
    try {
      console.log("initializeloginPage_Button　パス書き換え前");
      window.history.pushState({ page: "login" }, "", "/login");
      console.log("initializeloginPage_Button　ログインページに書き換え前");
      router();
    } catch (error) {
      console.error("initializeloginPage_Button　何かがおかしい");
      throw new Error("Page Refresh error");
    }
  });
};
