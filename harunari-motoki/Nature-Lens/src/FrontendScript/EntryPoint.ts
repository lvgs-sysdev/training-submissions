import { viewIndex } from "./View/users/viewIndex.ts";
import { initializeScanButton } from "./View/scan/initializeScanButton.ts";
import { initializeRegisterButton } from "./View/users/initializeRegisterButton.ts";
import { initializeLoginButton } from "./View/users/initializeLoginButton.ts";
import { initializeToppageButton } from "./View/users/initializeToppageButton.ts";
import { updateRegisterPage } from "./Viewmodel/users/updateRegisterPage.ts";
import { updateTopPage } from "./Viewmodel/users/updateTopPage.ts";

export const router = async () => {
  const path = window.location.pathname;
  const isFirstVisit = !sessionStorage.getItem("hasVisited");

  if (path === "/register") {
    await updateRegisterPage();
    initializeToppageButton(); //topページボタン
    //登録ボタン
  } else if (path === "/" && isFirstVisit) {
    await viewIndex(); //topページ表示
    sessionStorage.setItem("hasVisited", "true");
    initializeRegisterButton(); //新規登録ボタン
    initializeLoginButton(); //ログインボタン
  } else if (path === "/") {
    await updateTopPage(); //topページ表示
    initializeRegisterButton(); //新規登録ボタン
    initializeLoginButton(); //ログインボタン
  }
};
// initializeScanButton(); //scanボタン関数
window.addEventListener("popstate", router);

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    console.log("ボタン検知！");
    document.addEventListener("DOMContentLoaded", router);
  } else {
    console.log("ボタン検知！");
    router();
  }
}
