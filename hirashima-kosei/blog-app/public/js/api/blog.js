import { ordinaryApiClient } from './api-client.js';
import { authorizedApiClient } from './api-client.js';

export const countPages = async (userId = '', limit) => {
	try {
		const response = await ordinaryApiClient.get('/blog/count', {
			params: {
				userId,
				limit,
			},
		});

		return response.data.countAllPages;
	} catch (err) {
		if (err.response) {
			throw err.response.data.error;
		}
		throw '接続エラー';
	}
};

export const fetchArticleList = async (userId = '', limit, page) => {
	try {
		const response = await ordinaryApiClient.get('/blog/list', {
			params: {
				userId,
				limit,
				page,
			},
		});

		return response.data.pageItems;
	} catch (err) {
		if (err.response) {
			throw err.response.data.error;
		}
		throw '接続エラー';
	}
};

export const fetchArticleItems = async (id) => {
	try {
		const response = await authorizedApiClient.get('/blog/article', { id });

		const articleItems = response.data.articleItems;

		return articleItems;
	} catch (err) {
		throw err;
	}
};

export const putArticleItems = async (id, articleTitle, content) => {
	try {
		const response = await authorizedApiClient.put('/blog/editBlog', {
			id,
			articleTitle,
			content,
		});

		return response.data.msg;
	} catch (err) {
		throw err;
	}
};
