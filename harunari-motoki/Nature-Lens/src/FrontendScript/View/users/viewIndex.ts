import { updateTopPage } from "../../Viewmodel/users/updateTopPage.ts";

export const viewIndex = async () => {
  const viewTopPage = document.querySelector(".app");

  if (!viewTopPage) {
    return;
  } else {
    try {
      window.history.pushState({}, "", "/");
      //新規登録画面に書き換え
      await updateTopPage();
    } catch (error) {
      throw new Error("Page Refresh error");
    }
  }
};
