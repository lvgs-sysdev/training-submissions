import { viewIndex } from "./View/users/viewIndex.js";
import { initializeScan_Button } from "./View/scan/initializeScan_Button.js";
import { initializeLoginPage_Button } from "./View/users/initializeLoginPage_Button.js";
import { initializeRegisterPage_Button } from "./View/users/initializeRegisterPage_Button.js";
import { initializeToppage_Button } from "./View/users/initializeToppage_Button.js";
import { initializeRegister_Button } from "./View/users/initializeRegister_Button.js";
import { initializeLogin_Button } from "./View/users/initializeLogin_Button.js";
import { initializeLogout_Button } from "./View/users/initializeLogout_Button.js";
import { updateRegisterPage } from "./Viewmodel/users/updateRegisterPage.js";
import { updateLoginPage } from "./Viewmodel/users/updateLoginPage.js";
import { updateTopPage } from "./Viewmodel/users/updateTopPage.js";
import { updateScanPage } from "./Viewmodel/scan/updateScanPage.js";
import { postSilentRefresh } from "./APIservice/users/postSilentRefresh.js";
import { updateScanResult } from "./Viewmodel/scan/updateScanResult.js";
import { GBIFdetailInfo } from "../library/scan/typeDeffinition.js";

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
