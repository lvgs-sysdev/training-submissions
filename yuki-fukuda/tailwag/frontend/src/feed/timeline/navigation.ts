import { refreshTimeline } from "./timeline";

export const initNavigation = () => {
  // 1. ログアウト
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("token");
      location.reload();
    };
  }

  // 2. ホーム
  const homeBtn = document.getElementById("to-home");
  if (homeBtn) {
    homeBtn.onclick = (e) => {
      e.preventDefault();
      if (document.getElementById("posts-list")) {
        refreshTimeline();
        window.scrollTo(0, 0);
      } else {
        location.href = "/";
      }
    };
  }

  // 💡 3. マイページボタン
  const toMypageBtn = document.getElementById("to-mypage");
  if (toMypageBtn) {
    toMypageBtn.onclick = async (e) => {
      e.preventDefault();
      console.log("マイページボタンが押されました🐾");
      // 動的インポートでマイページを起動
      const { initMypage } = await import("../../mypage/mypage.js");
      initMypage();
    };
  }

  // 4. 検索バー
  const input = document.getElementById("search-input") as HTMLInputElement;
  const btn = document.getElementById("search-btn");
  if (input && btn) {
    const doSearch = () => refreshTimeline(input.value.trim() || undefined);
    btn.onclick = (e) => {
      e.preventDefault();
      doSearch();
    };
    input.onkeydown = (e) => {
      if (e.key === "Enter") doSearch();
    };
  }
};
