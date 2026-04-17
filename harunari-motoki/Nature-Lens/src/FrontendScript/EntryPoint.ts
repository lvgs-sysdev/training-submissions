import { viewIndex } from "./View/users/viewIndex.ts";
import { initializeScan_Button } from "./View/scan/initializeScan_Button.ts";
import { initializeLoginPage_Button } from "./View/users/initializeLoginPage_Button.ts";
import { initializeRegisterPage_Button } from "./View/users/initializeRegisterPage_Button.ts";
import { initializeToppage_Button } from "./View/users/initializeToppage_Button.ts";
import { initializeRegister_Button } from "./View/users/initializeRegister_Button.ts";
import { initializeLogin_Button } from "./View/users/initializeLogin_Button.ts";
import { updateRegisterPage } from "./Viewmodel/users/updateRegisterPage.ts";
import { updateLoginPage } from "./Viewmodel/users/updateLoginPage.ts";
import { updateTopPage } from "./Viewmodel/users/updateTopPage.ts";
import { updateScanPage } from "./Viewmodel/scan/updateScanPage.ts";

export const router = async () => {
  const path = window.location.pathname;
  const isFirstVisit = !sessionStorage.getItem("hasVisited");

  if (path === "/register") {
    await updateRegisterPage();
    initializeToppage_Button(); //topページ遷移
    initializeRegister_Button(); //新規登録
  } else if (path === "/login") {
    await updateLoginPage(); //ログインページ表示
    initializeToppage_Button(); //トップページ移動
    initializeLogin_Button(); //ログイン
  } else if (path === "/scan") {
    await updateScanPage(); //スキャンページ表示
    initializeScan_Button();
    // initializeLogout_Button(); //ログアウト
  } else if (path === "/" && isFirstVisit) {
    await viewIndex(); //topページ表示
    sessionStorage.setItem("hasVisited", "true");
    initializeRegisterPage_Button(); //新規登録ページ遷移
    initializeLoginPage_Button(); //ログインページ遷移
  } else if (path === "/") {
    await updateTopPage(); //topページ表示
    initializeRegisterPage_Button(); //新規登録ページ遷移
    initializeLoginPage_Button(); //ログイページ遷移
  }
};
// initializeScanButton(); //scanボタン関数
window.addEventListener("popstate", router);

try {
  if (typeof window !== "undefined") {
    if (document.readyState === "loading") {
      console.log("ボタン検知！");
      document.addEventListener("DOMContentLoaded", router);
    } else {
      console.log("ボタン検知！");
      router();
    }
  }
} catch (error) {
  console.error(error);
  alert(error);
}
