import { fetchArticleList, countPages } from './api/blog.js';
import parseDate from './lib/parse-date.js';
import paramToValue from './lib/param-to-value.js';

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const active = document.getElementsByClassName('active');

const limit = 6;

const displayData = async (currentPage) => {
	const userId = !paramToValue('user_id') ? '' : paramToValue('user_id');

	try {
		const pageItems = await fetchArticleList(userId, limit, currentPage);

		const blogList = document.getElementById('blog_list');
		blogList.innerHTML = '';
		for (let i = 0; i < pageItems.length; i += 2) {
			const item1 = pageItems[i];
			const item2 = pageItems[i + 1];
			const article = document.createElement('div');
			article.className = 'row pb-lg-5';
			let colHtml = `
				<a class="d-block text-decoration-none col-12 col-lg-6 list-item pt-3" href=/detail?id=${item1.id}>
            		<img src=${item1.article_image} alt="Travel Image" class="w-100 h-auto mb-4">
            		<p>
						<span class="text-category">Travel</span>
						<span class="text-date">${' ' + String(parseDate(item1.updated_at))}</span>
            		</p>
					<p class="text-article-title">${item1.article_title}</p>
					<p class="text-part-of-content text-multiline-ellipsis w-100">${parseHtml(item1.content)}</p>
				</a>
    		`;
			if (item2) {
				colHtml += `
					<a class="d-block text-decoration-none col-12 col-lg-6 list-item pt-3" href=/detail?id=${item2.id}>
						<img src=${item2.article_image} alt="Travel Image" class="w-100 h-auto mb-4">
						<p>
							<span class="text-category">Travel</span>
							<span class="text-date">${' ' + String(parseDate(item2.updated_at))}</span>
						</p>
						<p class="text-article-title">${item2.article_title}</p>
						<p class="text-part-of-content text-multiline-ellipsis w-100">${parseHtml(item2.content)}</p>
					</a>
				`;
			}
			// インナーHTMLはサニタイズした上で表示
			article.innerHTML = DOMPurify.sanitize(colHtml);
			blogList.appendChild(article);
		}
	} catch (err) {
		alert(err);
	}
};

const displayPagination = async () => {
	try {
		const userId = !paramToValue('user_id') ? '' : paramToValue('user_id');
		const paginateButton = document.getElementById('paginate_button');
		const lastPage = await countPages(userId, limit);

		for (let i = 1; i <= lastPage; i++) {
			const pageButton = document.createElement('button');
			pageButton.textContent = i;
			pageButton.addEventListener('click', (e) => {
				const allPageButtons = document.querySelectorAll('#paginate_button button');
				allPageButtons.forEach((button) => button.classList.remove('active'));
				e.target.classList.add('active');
				disabledButton();
				displayData(i);
			});
			paginateButton.appendChild(pageButton);
		}
	} catch (err) {
		alert(err);
	}
};

const disabledButton = () => {
	const firstPageButton = document.querySelector('#paginate_button button:first-child');
	firstPageButton.classList.contains('active') ? (prev.disabled = true) : (prev.disabled = false);

	const lastPageButton = document.querySelector('#paginate_button button:last-child');
	lastPageButton.classList.contains('active') ? (next.disabled = true) : (next.disabled = false);
};

prev.addEventListener('click', () => {
	const activeNum = parseInt(active[0].textContent);
	const prevPage = activeNum > 1 ? activeNum - 1 : 1;
	const prevButton = document.querySelector(`#paginate_button button:nth-child(${prevPage})`);
	const allPageButtons = document.querySelectorAll('#paginate_button button');
	allPageButtons.forEach((button) => button.classList.remove('active'));
	prevButton.classList.add('active');
	displayData(prevPage);
	disabledButton();
});

next.addEventListener('click', async () => {
	const userId = !paramToValue('user_id') ? '' : paramToValue('user_id');
	const activeNum = parseInt(active[0].textContent);
	const totalPages = await countPages(userId, limit);
	const nextPage = activeNum < totalPages ? activeNum + 1 : totalPages;
	const nextButton = document.querySelector(`#paginate_button button:nth-child(${nextPage})`);
	const allPageButtons = document.querySelectorAll('#paginate_button button');
	allPageButtons.forEach((button) => button.classList.remove('active'));
	nextButton.classList.add('active');
	displayData(nextPage);
	disabledButton();
});

window.addEventListener('DOMContentLoaded', async () => {
	await displayPagination();
	const firstPageButton = document.querySelector('#paginate_button button:first-child');
	firstPageButton.classList.add('active');
	disabledButton();
	await displayData(1);
});

function parseHtml(rawHtml) {
	return rawHtml.replace(/<[^>]*>/g, '');
}
