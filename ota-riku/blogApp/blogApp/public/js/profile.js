document.addEventListener("DOMContentLoaded", () => {
  const idTextElement = document.getElementById("userIdText");
  const nameTextElement = document.getElementById("userNameText");
  getUserInfo();

  async function getUserInfo() {
    try {
      // fetchメソッドのタイムアウト設定
      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), 10000);
      const response = await fetch("/api/user-info", {
        signal: abortController.signal,
      });
      // タイマーのリセット
      clearTimeout(timeout);
      if (response.ok) {
        const userInfo = await response.json();
        console.log(userInfo);
        idTextElement.innerText = userInfo.userId;
        nameTextElement.innerText = userInfo.userName;
      } else {
        const error = new Error(
          `HTTP Error is occored.${response.status} ${response.statusText}`
        );
        error.statusCode = response.status;
        error.statusText = response.statusText;
        throw error;
      }
    } catch (e) {
      window.location.href = `/error/${e.statusCode}`;
    }
  }
});
