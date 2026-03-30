import { API_BASE_URL } from "./config.js";

document.addEventListener("click", async (event) => {
  if (event.target && event.target.id === "logout-btn") {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        alert("ログアウトに成功しました。");
        window.location.href = "./index.html";
      }
    } catch (err) {
      console.error("ログアウト失敗", err);
    }
  }
});
