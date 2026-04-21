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
    await postSilentRefresh();
    const path = window.location.pathname;
    const isFirstVisit = !sessionStorage.getItem("hasVisited");

    if (path === "/register") {
      await updateRegisterPage();
      initializeToppage_Button();
      initializeRegister_Button();
    } else if (path === "/login") {
      await updateLoginPage();
      initializeToppage_Button();
      initializeLogin_Button();
    } else if (path === "/scan") {
      await updateScanPage();
      initializeScan_Button();
      initializeLogout_Button();
    } else if (path === "/scanResult") {
      const state =
        (history.state as { count: number; results: GBIFdetailInfo[] }) || null;
      if (state && state.results) {
        console.log("リロード後の中身", state.count);
        console.log("リロード後の中身", state.results);
        await updateScanResult(state.count, state.results);
      } else {
        history.replaceState(null, "", "/scan");
        router();
      }
      initializeScan_Button();
      initializeLogout_Button();
    } else if (path === "/" && isFirstVisit) {
      await viewIndex();
      sessionStorage.setItem("hasVisited", "true");
      initializeRegisterPage_Button();
      initializeLoginPage_Button();
    } else if (path === "/") {
      await updateTopPage();
      initializeRegisterPage_Button();
      initializeLoginPage_Button();
    }
  } catch (error) {
    console.error("Router Error:", error);
  }
};
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
