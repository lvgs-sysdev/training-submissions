const editblogForm = document.getElementById("edit-blog-form");

editblogForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // articleIdの取得
  const url = new URL(window.location.href);
  const path = url.pathname.split("/");
  const articleId = path[path.length - 1];

  // articleTitleの取得
  const articleTitle = document.getElementById("title-input").value;

  // articleContextの取得
  const articleContext = document.getElementById("context-input").value;

  try {
    const response = await fetch("/editBlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        articleId: articleId,
        title: articleTitle,
        context: articleContext,
      }),
    });

    if (response.ok) {
      console.log("Edit Completed.");
      window.location.href = "/home";
    }
  } catch (e) {
    console.log(e);
  }
});
