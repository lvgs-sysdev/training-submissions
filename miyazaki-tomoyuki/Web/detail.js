document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");
  const message = urlParams.get("success")
  fetch(`/articleDetail?id=${articleId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("エラーが発生しました");
      }
      return response.json();
    })
    .then(articleData => {
      let htmlToInsert = "";
      const articleListContainer = document.getElementById("detail");
      if (urlParams.get("msg")) {
        htmlToInsert = htmlToInsert + `
                <p class="msg">${urlParams.get("msg")}</p>
                `;
      }
      htmlToInsert = htmlToInsert + `
                  <p class="post-writer-name"><a href="/user?id=${articleData.user_id}">${articleData.user_name}</a></p>
                  <h1>${articleData.article_title}</h1>
                  <p>${(escapeHtml(articleData.content)).replace(/\n/g, '<br>')}</p>
                  <a href="/editBlog?id=${articleData.id}"><button>編集</button></a>
              `;
      document.title = `${articleData.article_title}｜DAYDAYTRAVEL`
      articleListContainer.innerHTML = htmlToInsert;
    })
    .catch(error => {
      console.error(("データの取得中にエラーが発生しました：", error));
      const articleListContainer = document.getElementById("detail");
      articleListContainer.innerHTML = `<p>記事の読み込みに失敗しました。</p>`;
    });
});