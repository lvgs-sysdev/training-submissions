import { initializeScanButton } from "./View/initializeScanButton.ts";

const setupApp = () => {
  initializeScanButton(); //scanボタン関数
};

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    console.log("ボタン検知！");
    document.addEventListener("DOMContentLoaded", setupApp);
  } else {
    console.log("ボタン検知！");
    setupApp();
  }
}
