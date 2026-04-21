import { viewIndex } from "./View/users/viewIndex.ts";
import { initializeScan_Button } from "./View/scan/initializeScan_Button.ts";
import { initializeLoginPage_Button } from "./View/users/initializeLoginPage_Button.ts";
import { initializeRegisterPage_Button } from "./View/users/initializeRegisterPage_Button.ts";
import { initializeToppage_Button } from "./View/users/initializeToppage_Button.ts";
import { initializeRegister_Button } from "./View/users/initializeRegister_Button.ts";
import { initializeLogin_Button } from "./View/users/initializeLogin_Button.ts";
import { initializeLogout_Button } from "./View/users/initializeLogout_Button.ts";
import { updateRegisterPage } from "./Viewmodel/users/updateRegisterPage.ts";
import { updateLoginPage } from "./Viewmodel/users/updateLoginPage.ts";
import { updateTopPage } from "./Viewmodel/users/updateTopPage.ts";
import { updateScanPage } from "./Viewmodel/scan/updateScanPage.ts";
import { postSilentRefresh } from "./APIservice/users/postSilentRefresh.ts";
import { updateScanResult } from "./Viewmodel/scan/updateScanResult.ts";
import { GBIFdetailInfo } from "@/library/scan/typeDeffinition.ts";

export const router = async () => {
  try {
    console.log("EnrtyPoint.ts　もしかしてスキャン下後もう一回読み込んでる？");
    await postSilentRefresh(); //routing前にトークン情報を更新
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
      initializeLogout_Button(); //ログアウト
    } else if (path === "/scanResult") {
      const state =
        (history.state as { count: number; results: GBIFdetailInfo[] }) || null;
      if (state && state.results) {
        console.log("リロード後の中身", state.count);
        console.log("リロード後の中身", state.results);
        await updateScanResult(state.count, state.results); //スキャンページ表示
      } else {
        history.replaceState(null, "", "/scan");
        router(); // 再度自分を呼び出して /scan の処理をさせる
      }
      initializeScan_Button();
      initializeLogout_Button(); //ログアウト
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
  } catch (error) {
    console.error("Router Error:", error);
    //エラーが出たことを示す画面への誘導をする
  }
};
// initializeScanButton(); //scanボタン関数
window.addEventListener("popstate", router);

try {
  if (typeof window !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", router);
    } else {
      router();
    }
  }
} catch (error) {
  console.error(error);
  alert(error);
}
