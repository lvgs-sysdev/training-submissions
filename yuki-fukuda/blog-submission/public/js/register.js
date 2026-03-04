const regBtn = document.querySelector("#register-form");

regBtn.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("ボタンが押されました！");

  const user_id = document.querySelector("#user_id").value;
  console.log("ID:", user_id);
  const password = document.querySelector("#password").value;
  const user_name = document.querySelector("#user_name").value;

  try {
    const response = await fetch("https://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, password, user_name }),
    });

    const result = await response.json();
    alert(result.message);
    window.location.href = "./index.html";
  } catch (err) {
    console.error("登録中にエラーが発生しました:", err);
    alert("登録中にエラーが発生しました。");
  }
});
