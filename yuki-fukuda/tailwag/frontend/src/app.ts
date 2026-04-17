import { initLogin } from "./auth/login/index";
import { initTimeline } from "./feed/timeline/timeline";

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  //トークンがある場合、タイムラインを表示
  if (token) {
    console.log("ログイン済みです");
    initTimeline("root");
  } else {
    console.log("未ログインです");
    initLogin("root");
  }
});
