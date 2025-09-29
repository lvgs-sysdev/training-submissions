import { apiClient } from './api-client.js';

export const countPages = async (userId = '', limit) => {
	try {
		const response = await apiClient.get('/blog/count', {
			params: {
				userId,
				limit,
			},
		});

		return response.data.countAllPages;
	} catch (err) {
		throw err;
	}
};

export const fetchArticleItems = async (userId = '', limit, page) => {
	try {
		const response = await apiClient.get('/blog/list', {
			params: {
				userId,
				limit,
				page,
			},
		});

		return response.data.pageItems;
	} catch (err) {
		throw err;
	}
};

export const fetchArticleDetails = async (id) => {
	try {
		const response = await apiClient.get('/blog/article', { params: { id } });

		const articleDetails = response.data.articleDetails;

		return articleDetails;
	} catch (err) {
		throw err;
	}
};

export const putArticleDetails = async (id, articleTitle, content) => {
	try {
		const response = await apiClient.put('/blog/editBlog', {
			id,
			articleTitle,
			content,
		});

		return response.data.msg;
	} catch (err) {
		throw err;
	}
};
