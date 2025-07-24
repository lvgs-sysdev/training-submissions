document.addEventListener('DOMContentLoaded', () => {
  fetch("/loginStatus")
    .then(response => response.json())
    .then(status => {
      let htmlToInsert = "";
      const articleListContainer = document.getElementById("login-status");
      if (status) {
        htmlToInsert = htmlToInsert + `
                <li class="login"><a href="/logout">Logout</a></li>
                <li class="start">ログイン中</li>
                `;
      } else {
        htmlToInsert = htmlToInsert + `
                <li class="login"><a href="/login">Login</a></li>
                <li class="start"><a href="/register">Get started</a></li>
                `;
      }
      articleListContainer.innerHTML = htmlToInsert;
    })
    .catch(error => {
      console.error(("ヘッダー表示時にエラーが発生しました：", error));
      const articleListContainer = document.getElementById("login-status");
      articleListContainer.innerHTML = `<p>ヘッダーの表示に失敗しました。</p>`;
    });
});