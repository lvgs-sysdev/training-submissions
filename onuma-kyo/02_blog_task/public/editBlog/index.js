import * as apiClient from '../assets/js/apiClient.js';

window.onload = async function () {
  const regexpCoordinates = /\/editBlog\/(\d+)/;
  const match = window.location.pathname.match(regexpCoordinates);

  const apiEndpoint = `/articles/${match[1]}`;
  console.log(apiEndpoint);
  const result = await apiClient.get(apiEndpoint);
  console.log(result);
  if (result.error) {
    // レスポンスが失敗の場合、エラーメッセージを画面表示
    document.querySelector('.form__error-message .error-message--line').innerText = JSON.stringify(
      result.message,
    );
    return;
  }

  const tags = await apiClient.get('/tags');
  const eTagSelect = document.getElementById('blog-edit-tag');
  while (eTagSelect.firstChild) {
    eTagSelect.removeChild(eTagSelect.firstChild);
  }
  tags.map((tag) => {
    const child = document.createElement('option');
    child.setAttribute('value', tag.tagId);
    child.textContent = tag.name;
    // document.getElementById('blog-edit-tag').appendChild(child);
    eTagSelect.appendChild(child);
  });

  document.getElementById('blog-edit-form-title').value = result.articleTitle;
  document.getElementById('blog-edit-form-content').value = result.content;
  const currentTag = tags.find((tag) => tag.name === result.tag);
  console.log(currentTag);
  document.getElementById('blog-edit-tag').value = currentTag.tagId;
};

document.getElementById('blog-edit-form').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent default form submission
  const regexpCoordinates = /\/editBlog\/(\d+)/;
  const match = window.location.pathname.match(regexpCoordinates);

  const apiEndpoint = `/articles/edit/${match[1]}`;
  console.log(apiEndpoint);

  const articleTitle = document.getElementById('blog-edit-form-title').value;
  const content = document.getElementById('blog-edit-form-content').value;
  const tagId = document.getElementById('blog-edit-tag').value;

  const dataBody = {
    articleTitle: articleTitle,
    content: content,
    tagId: Number.parseInt(tagId),
  };

  const csrfToken = localStorage.getItem('csrfToken');

  const result = await apiClient.put(apiEndpoint, dataBody, csrfToken);
  if (result.error) {
    // レスポンスが失敗の場合、エラーメッセージを画面表示
    document.querySelector('.form__error-message .error-message--line').innerText = JSON.stringify(
      result.message,
    );
    return;
  }
  // レスポンスが成功の場合、アラート出す。元ユーザーIDを変更。
  alert('更新完了しました。');
});
