const editForm = document.querySelector(".editBlogFrom");

if (editForm) {
  editForm.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (event.target.nodeName !== "TEXTAREA") {
        event.preventDefault();
        console.log("Enterキーによる誤送信を防ぎました");
      }
    }
  });
}

const EditBlogFrom = document.querySelectorAll(".editBlogFrom");

EditBlogFrom.forEach((formElement) => {
  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const blogObject = Object.fromEntries(formData.entries());
    console.log("送信するデータは", blogObject, "です");

    try {
      const response = await fetch("/editBlog", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(blogObject),
      });

      const result = await response.json();

      if (result.success) {
        alert("ブログ記事更新成功！");
      } else {
        alert("エラーが発生しました");
      }
    } catch (error) {
      console.error("通信失敗", error);
    }
  });
});
