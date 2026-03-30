// 記事フォームの送信処理を設定する関数
export function setupArticleFormSubmission(form, submitButton) {
  if (!form || !submitButton) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = '保存中...';

    try {
      const idInput = form.querySelector('input[name="id"]');
      const isEditing = !!idInput;

      const endpoint = isEditing ? '/api/update-article' : '/api/save-article';

      const formData = new FormData(form);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const idInput = form.querySelector('input[name="id"]');
        const articleId = idInput ? idInput.value : (result.id || null);
        alert(result.message);
        if (articleId) {
          window.location.href = `/article/${articleId}`;
        }
      } else {
        console.error('保存失敗:', result);
        alert(`保存に失敗しました: ${result.message}`);
      }

    } catch (error) {
      console.error('送信エラー:', error);
      alert('通信中にエラーが発生しました');

    } finally {
      submitButton.textContent = '記事を保存';
      submitButton.disabled = false;
    }
  });
}
