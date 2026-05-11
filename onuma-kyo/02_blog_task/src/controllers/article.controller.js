import * as usecase from '../usecase/article.usecase.js';
import { UnauthorizedError } from '../utils/customError.js';

export const getArticlesHandler = async (request, reply) => {
  const { limit } = request.query;
  const articles = await usecase.getArticles(limit);
  reply.code(200);
  reply.headers({ 'Content-Type': 'application/json' });
  reply.send(articles);
};

export const getArticleHandler = async (request, reply) => {
  const { id } = request.params;
  const article = await usecase.getArticle(id);
  reply.code(200);
  reply.headers({ 'Content-Type': 'application/json' });
  reply.send(article);
};

export const addArticleHandler = async (req, reply) => {
  const { articleTitle, content, userId } = req.body;
  await usecase.addArticle(articleTitle, content, userId);
  reply.type('application/json').code(201);
  reply.send(JSON.stringify({ message: 'Article added' }));
};

export const updateArticleHandler = async (req, reply) => {
  const { articleTitle, content, tagId } = req.body;
  const { id } = req.params;
  // CsrfTokenの検証
  const clientCsrfToken = req.headers['x-csrf-token'];
  const serverCsrfToken = req.session.csrfToken;
  if (clientCsrfToken !== serverCsrfToken) {
    throw new UnauthorizedError(`CSRFトークンの検証に失敗しました`);
  }
  await usecase.updateArticle(id, articleTitle, content, tagId);
  reply.type('application/json').code(200);
  reply.send(JSON.stringify({ message: 'Article updated' }));
};
