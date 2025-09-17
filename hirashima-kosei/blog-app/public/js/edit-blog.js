import { fetchArticleItems, putArticleItems } from './api/blog.js';
import paramToValue from './lib/param-to-value.js';

const editBlog = async () => {
	const id = paramToValue('id');

	try {
		const { article_title, content, editArticleFlg } = await fetchArticleItems(id);

		const inputArticleTitle = document.getElementById('input_article_title');
		inputArticleTitle.value = article_title;

		const inputContent = document.getElementById('input_content');
		inputContent.value = DOMPurify.sanitize(content);

		const hiddenId = document.getElementById('hidden_id');
		hiddenId.value = id;

		const cancelBtn = document.getElementById('cancel');
		cancelBtn.href = `/detail?id=${id}`;

		const editBlogBtn = document.getElementById('commit_change');
		if (!editArticleFlg) {
			editBlogBtn.classList.add('d-none');
		}

		const submitBlogChange = document.getElementById('submit_blog_change');
		submitBlogChange.addEventListener('submit', async (event) => {
			event.preventDefault();

			const articleTitle = inputArticleTitle.value;
			const content = inputContent.value;
			const id = hiddenId.value;

			try {
				const msg = await putArticleItems(id, articleTitle, content);
				alert(msg);
				window.location.href = `/detail?id=${id}`;
			} catch (err) {
				alert(err);
			}
		});
	} catch (err) {
		alert(err);
	}
};

window.addEventListener('DOMContentLoaded', editBlog);
