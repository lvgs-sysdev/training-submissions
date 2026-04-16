import { router } from "../../EntryPoint.ts";

export const initializeRegisterButton = () => {
  const RegisterButton = document.querySelector(".register_button");

  if (!RegisterButton) {
    console.error("何かがおかしい");
    return;
  }
  console.log("クリックイベント検知前");
  RegisterButton.addEventListener("click", async () => {
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
