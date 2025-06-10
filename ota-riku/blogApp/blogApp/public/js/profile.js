document.addEventListener("DOMContentLoaded", () => {
  const idTextElement = document.getElementById("userIdText");
  const nameTextElement = document.getElementById("userNameText");
  getUserInfo();

  async function getUserInfo() {
    try {
      const response = await fetch("/api/user-info");
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
