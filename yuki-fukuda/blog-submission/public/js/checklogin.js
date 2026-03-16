import { API_BASE_URL } from "./config.js";

async function checkLogin() {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      credentials: "include",
    });
    const auth = await response.json();

    const postArea = document.getElementById("post-area");
    const loginMessage = document.getElementById("login-message");
    const loginLink = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const myPageBtn = document.getElementById("mypage-btn");

    if (auth.loggedIn) {
      console.log("ようこそ、" + auth.user.user_name + "さん");
      if (postArea) postArea.style.display = "block";
      if (loginMessage) loginMessage.style.display = "none";
      if (loginLink) loginLink.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline";
      if (myPageBtn) {
        if (window.location.pathname.includes("edit-profile.html")) {
          myPageBtn.textContent = "トップページ";
          myPageBtn.href = "index.html";
        } else {
          myPageBtn.textContent = "マイページ";
          myPageBtn.href = "edit-profile.html";
        }
      }
    } else {
      console.log("未ログイン状態です");

      if (postArea) postArea.style.display = "none";
      if (loginMessage) loginMessage.style.display = "block";
      if (loginLink) loginLink.style.display = "inline";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  } catch (err) {
    console.error("通信エラー:", err);
  }
}

document.addEventListener("componentLoaded", () => {
  checkLogin();
});
