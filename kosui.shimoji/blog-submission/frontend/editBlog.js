

const form = document.getElementById('edit-blog-form')
const message = document.getElementById('message')
const titleInput = document.getElementById('article_title')
const contentInput = document.getElementById('content')

const params = new URLSearchParams(window.location.search)
const articleId = params.get('id')


async function loadArticle() {
    try {
        const response = await fetch('http://localhost:3000/articles/' + articleId)
        if (!response.ok) {

            message.textContent = '記事が見つかりません'
        return
        }

        const article = await response.json()
        titleInput.value = article.article_title
        contentInput.value = article.content
    } catch (error) {
        console.error(error)
        message.textContent = 'サーバーに接続できませんでした'
    }
}

// ② フォーム送信時：PUT /articles/:id で保存
form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const article_title = titleInput.value
    const content = contentInput.value

    try {
    const response = await fetch('http://localhost:3000/articles/' + articleId, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_title, content })
    })

    const result = await response.json()

    if (response.ok) {
        message.textContent = '記事を更新しました'
    } else {
        message.textContent = 'エラー: ' + result.error
    }
    } catch (error) {
        console.error(error)
        message.textContent = 'サーバーに接続できませんでした'
        }
    })

loadArticle()