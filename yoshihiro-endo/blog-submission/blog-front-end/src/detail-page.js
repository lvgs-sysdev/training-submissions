import './common-settings.css'
import './detail-page.css'
import { checkLoginStatus } from './sessionInfo.js';

const API_URL = import.meta.env.VITE_API_URL;

// 3. ページが読み込まれたら（DOMの構築が完了したら）実行する
document.addEventListener('DOMContentLoaded', () => {
    fetchArticle();
});

const articleElement = document.getElementById('article');
const mainHeaderElement = document.getElementById('main-header-left');

// URLからクエリパラメーターとして使っているidの値を取得する
const params = new URLSearchParams(window.location.search);
const articleId = params.get('id');

// R (Read) - アイテム一覧を取得して表示
async function fetchArticle() {
  try {
    const response = await fetch(`${API_URL}/detail/${articleId}`);
    if (!response.ok) throw new Error('アイテムの取得に失敗しました');
    const info = await response.json();

    renderArticle(info);
  } catch (error) {
    console.error(error);
    articleElement.innerHTML = '<li>エラーが発生しました</li>';
  }
}

// アイテム一覧をHTMLに描画
async function renderArticle(info) {
    articleElement.innerHTML = ''; // リストをクリア

    const article = info.articleInfo;
    const author = info.authorInfo;

    if (article.length === 0) {
        articleElement.innerHTML = '<li>アイテムはありません</li>';
        return;
    }

    articleElement.dataset.id = article.id; // data属性にidを保持

    const formattedDate = new Date(article.updated_at).toLocaleDateString('ja-JP');

    const user = await checkLoginStatus();

    mainHeaderElement.innerHTML = ``;
    mainHeaderElement.innerHTML = `
    <img src=${author.picture} alt="投稿者-Karen Smithのプロフィール画像" class="pic-of-author">
            <div class="post-info">
              <div class="main-name-author">${author.user_name}</div>
              <div class="date-of-post">19 Feb 2022</div>
            </div>
    `;
    
    if (article.user_id === user.user_id) {
    articleElement.innerHTML = `
    <div class="article-1">
        <h2 class="main-title" id="title" data-field="article_title">${article.article_title}</h2>
        <p class="text" id="content" data-field="content">${article.content}</p>
        <button><a href="./editBlog.html?id=${article.id}">編集</a></button>            
        <div class="image-container">
            <img src=${article.picture} class="main-big-image">
        </div>
        <p class="image-description">画像の説明文</p>
        <p class="main-footer">Culinary</p>
    </div>
    `;
    } else {
    articleElement.innerHTML = `
    <div class="article-1">
        <h2 class="main-title" id="title" data-field="article_title">${article.article_title}</h2>
        <p class="text" id="content" data-field="content">${article.content}</p>
        <div class="image-container">
            <img src=${article.picture} class="main-big-image">
        </div>
        <p class="image-description">画像の説明文</p>
        <p class="main-footer">Culinary</p>
    </div>
    `;
    }

    const handleEnterPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            
            e.preventDefault();

            const targetElement = e.target;
            
            try {
                saveChanges(targetElement)
            }catch(error) {
                console.error(`${fieldType}の更新に失敗`, error);
            }
            
            // 保存後、フォーカスを外す（任意）
            targetElement.blur();
        }
    };
}