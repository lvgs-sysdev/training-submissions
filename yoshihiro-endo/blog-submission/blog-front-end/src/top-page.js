import './common-settings.css'
import './top-page.css'
import './detail-page.css'

const API_URL = import.meta.env.VITE_API_URL;

// 3. ページが読み込まれたら（DOMの構築が完了したら）実行する
document.addEventListener('DOMContentLoaded', () => {
    fetchArticles();
});


const sectionElement = document.getElementById('main-contents-container');

// R (Read) - アイテム一覧を取得して表示
async function fetchArticles() {
  try {
    const response = await fetch(`${API_URL}/detail`);
    if (!response.ok) throw new Error('アイテムの取得に失敗しました');
    const articles = await response.json();

    renderArticles(articles);
  } catch (error) {
    console.error(error);
    sectionElement.innerHTML = '<li>エラーが発生しました</li>';
  }
}

// アイテム一覧をHTMLに描画
function renderArticles(articles) {
  sectionElement.innerHTML = ''; // リストをクリア
  if (articles.length === 0) {
    sectionElement.innerHTML = '<li>アイテムはありません</li>';
    return;
  }

  articles.forEach(article => {
    const articleElement = document.createElement('article');
    articleElement.id = 'article_container';
    articleElement.classList.add('main-contents');

    articleElement.dataset.id = article.id; // data属性にidを保持

    const formattedDate = new Date(article.updated_at).toLocaleDateString('ja-JP');

    articleElement.innerHTML = `
      <img src=${article.picture} class="main-contents-pictures">
      <div class="tag">
        <span class="category">Travel</span>
        <span class="date">${formattedDate}</span>
      </div>
      <p class="title"><a href="./detail.html?id=${article.id}">${article.article_title}</a></p>
      <p class="description">${article.content}</p>
    `;

    sectionElement.appendChild(articleElement);
  });
}