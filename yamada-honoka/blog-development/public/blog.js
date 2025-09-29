document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    const token = localStorage.getItem('token');
    
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');
    const editForm = document.getElementById('edit-form');
    const tagsInput = document.getElementById('tags');
    const messageDiv = document.getElementById('message');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch(`/article/${articleId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 403) {
                messageDiv.textContent = 'この記事を編集する権限がありません。';
            } else if (response.status === 404) {
                messageDiv.textContent = '記事が見つかりませんでした。';
            } else {
                messageDiv.textContent = '記事の読み込みに失敗しました。';
            }
            return;
        }

        const article = await response.json();
        titleInput.value = article.article_title;
        contentTextarea.value = article.content;

        if(article.tags &&  Array.isArray(article.tags)) {
            tagsInput.value = article.tags.join(',');
        } else {
            tagsInput.value = '';
        }

    } catch (error) {
        console.error('記事の読み込み中にエラーが発生しました:', error);
        messageDiv.textContent = '記事の読み込みに失敗しました。';
    }

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newTitle = titleInput.value;
        const newContent = contentTextarea.value;
        const newTagsInput = tagsInput.value;

        try {
            const response = await fetch(`/article/${articleId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ article_title: newTitle, content: newContent, tags: newTagsInput })
            });

            if (response.ok) {
                alert('記事を更新しました！');
                window.location.href = '/profile.html';
            } else {
                const errorData = await response.json();
                alert(`更新に失敗しました: ${errorData.message}`);
            }
        } catch (error) {
            console.error('通信エラーが発生しました:', error);
            alert('通信エラーが発生しました。');
        }
    });
});