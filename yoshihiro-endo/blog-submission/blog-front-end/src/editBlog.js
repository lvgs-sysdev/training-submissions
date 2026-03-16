import './common-settings.css'
import './detail-page.css'

const API_URL = import.meta.env.VITE_API_URL;

// 3. ページが読み込まれたら（DOMの構築が完了したら）実行する
document.addEventListener('DOMContentLoaded', () => {
    fetchArticle();
});

const articleElement = document.getElementById('article');

// URLからクエリパラメーターとして使っているidの値を取得する
const params = new URLSearchParams(window.location.search);
const articleId = params.get('id');

// R (Read) - アイテム一覧を取得して表示
async function fetchArticle() {
  try {
    const response = await fetch(`${API_URL}/detail/${articleId}`);
    if (!response.ok) throw new Error('アイテムの取得に失敗しました');
    const article = await response.json();

    renderArticle(article);
  } catch (error) {
    console.error(error);
    articleElement.innerHTML = '<li>エラーが発生しました</li>';
  }
}

// アイテム一覧をHTMLに描画
function renderArticle(article) {
    articleElement.innerHTML = ''; // リストをクリア

    if (article.length === 0) {
        articleElement.innerHTML = '<li>アイテムはありません</li>';
        return;
    }

    articleElement.dataset.id = article.id; // data属性にidを保持

    const formattedDate = new Date(article.updated_at).toLocaleDateString('ja-JP');

    articleElement.innerHTML = `
    <div class="article-1">
        <h2 class="main-title" id="title" data-field="article_title" contentEditable = "true">${article.article_title}</h2>
        <p class="text" id="content" data-field="content" contentEditable = "true">${article.content}</p>
        <button><a href="./detail.html?id=${article.id}">記事詳細ページに戻る</a></button>
    </div>
    `;

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

    // --- イベントリスナーを各要素に設定 ---
    const titleElement = document.getElementById('title');
    const contentElement = document.getElementById('content');

    titleElement.addEventListener('keydown', handleEnterPress);
    contentElement.addEventListener('keydown', handleEnterPress);
}



async function saveChanges(targetElement) {
    const newValue = targetElement.textContent;
    const fieldName = targetElement.dataset.field;

    // APIに送信
    try {
        const response = await fetch(`${API_URL}/editBlog/${articleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                [fieldName]: newValue // { title: '新しい値' } または { body: '新しい値' }
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('サーバーとの通信に失敗しました');
        }

        const updatedData = await response.json();
        console.log('更新成功:', updatedData);
    } catch (error) {
        console.error('更新エラー:', error);
    }
}