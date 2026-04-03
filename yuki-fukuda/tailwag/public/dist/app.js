import { initLogin } from "./auth/login/login.js";
import { initTimeline } from "./feed/timeline.js";
window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    //トークンがある場合、タイムラインを表示
    if (token) {
        console.log("ログイン済みです");
        initTimeline("root");
    }
    else {
        console.log("未ログインです");
        initLogin("root");
    }
});
//# sourceMappingURL=app.js.map