document.addEventListener("DOMContentLoaded", () => {
  const url = new URL(window.location.href);
  const path = url.pathname.split("/");
  articleId = path[path.length - 1];

  const loadArticleDetail = async (id) => {
    try {
      const responseArticleDB = await fetch("/api/article-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId: id }),
      });

      const articleInfo = await responseArticleDB.json();

      const responseUserDB = await fetch("/api/user-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: articleInfo.user_id }),
      });

      const userInfo = await responseUserDB.json();

      const profileNameElem = document.getElementById("author-name");
      profileNameElem.textContent = userInfo.userName;
      const articleDate = document.getElementById("date-text");
      articleDate.textContent = getDateText(articleInfo.updated_at);
      const articleTitleElem = document.getElementById("title-text");
      articleTitleElem.textContent = articleInfo.article_title;
      const articleContextElem = document.getElementById("context-container");
      articleContextElem.textContent = articleInfo.content;

      // 編集ボタン表示するか否か
      const responseLoginInfo = await fetch("/api/login-status");
      const loginInfo = await responseLoginInfo.json();
      if (loginInfo.loggedIn) {
        const responseLoginUserInfo = await fetch("/api/user-info");
        const loginUserInfo = await responseLoginUserInfo.json();
        if (loginUserInfo.userId == userInfo.userId) {
          const reviewHeaderElem = document.getElementById(
            "reviews-header-container"
          );
          const editButtonElem = document.createElement("a");
          editButtonElem.id = "edit-button";
          editButtonElem.classList.add("edit-button");
          editButtonElem.textContent = "編集する";
          editButtonElem.href = `/editBlog/${id}`;

          reviewHeaderElem.appendChild(editButtonElem);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  loadArticleDetail(articleId);
});

const getDateText = (dateStr) => {
  const dateObj = new Date(dateStr);
  console.log(dateStr);

  const monthStr = dateObj.toLocaleString("en-US", { month: "short" });
  return `${dateObj.getDate()} ${monthStr} ${dateObj.getFullYear()}`;
};
