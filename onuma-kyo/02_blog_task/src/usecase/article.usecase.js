import * as repository from '../repositories/article.repository.js';
import { NotFoundError } from '../utils/customError.js';

export const getArticles = async (limit) => {
  return repository.findAll(limit);
};

export const getArticle = async (id) => {
  const article = await repository.findByID(id);
  if (article.length == 0) {
    throw new NotFoundError(`指定された記事は登録されていません。 id: ${id}`);
  }
  return JSON.stringify(article[0]);
};

export const addArticle = async (articleTitle, content, userId) => {
  repository.create(articleTitle, content, userId);
};

export const updateArticle = async (id, articleTitle, content, tagId) => {
  const article = await repository.findByID(id);
  if (article.length == 0) {
    throw new NotFoundError(`指定された記事は登録されていません。 id: ${id}`);
  }
  repository.update(id, articleTitle, content, tagId);
};
