const profileEditFrom = document.querySelectorAll(".editUserFrom");

profileEditFrom.forEach((formElement) => {
  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const userObject = Object.fromEntries(formData.entries());
    console.log("送信するデータは", userObject, "です");

    try {
      const response = await fetch("/editUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(userObject),
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = result.redirectUrl;
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("通信失敗", error);
    }
  });
});
