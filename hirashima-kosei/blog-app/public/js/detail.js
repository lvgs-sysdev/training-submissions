import paramToValue from './lib/param-to-value.js';
import { fetchArticleItems } from './api/blog.js';
import parseDate from './lib/parse-date.js';

const insertArticle = async () => {
	const id = paramToValue('id');

	try {
		const { article_title, content, user_name, user_icon, updated_at, editArticleFlg } =
			await fetchArticleItems(id);

		const detailAuthorIcon = document.getElementById('detail_author_icon');
		// src属性はXSSのリスクがあるためサニタイズ
		detailAuthorIcon.src = DOMPurify.sanitize(user_icon);

		const detailAuthorName = document.getElementById('detail_author_name');
		detailAuthorName.textContent = user_name;

		const detailDate = document.getElementById('detail_date');
		detailDate.textContent = String(' ' + parseDate(updated_at));

		const detailArticleTitle = document.getElementById('detail_article_title');
		detailArticleTitle.textContent = article_title;

		const articleArea = document.getElementById('article_area');
		articleArea.innerHTML += DOMPurify.sanitize(content);

		const editArticleBtn = document.getElementById('edit_article');
		editArticleBtn.addEventListener('click', async () => {
			window.location.href = `/editBlog?id=${id}`;
		});
		if (!editArticleFlg) {
			editArticleBtn.classList.add('d-none');
		}
	} catch (err) {
		alert(err);
	}
};

window.addEventListener('DOMContentLoaded', insertArticle);
