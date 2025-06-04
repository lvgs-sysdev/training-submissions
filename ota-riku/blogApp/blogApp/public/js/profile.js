document.addEventListener("DOMContentLoaded", () => {
  const idTextElement = document.getElementById("userIdText");
  const nameTextElement = document.getElementById("userNameText");
  getUserInfo();

  async function getUserInfo() {
    const response = await fetch("/api/user-info");
    const userInfo = await response.json();
    console.log(userInfo);
    idTextElement.innerText = userInfo.userId;
    nameTextElement.innerText = userInfo.userName;
  }
});
