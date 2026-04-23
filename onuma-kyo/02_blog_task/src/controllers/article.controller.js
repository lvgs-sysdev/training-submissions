import * as usecase from '../usecase/article.usecase.js';

const handleError = (reply, error) => {
  console.error('Error: ', error);
  reply.code(500);
  reply.headers({ 'Content-Type': 'application/json' });
  return JSON.stringify({ message: 'Internal Server Error' });
};

export const getArticlesHandler = async (request, reply) => {
  try {
    const { limit } = request.query;
    const articles = await usecase.getArticles(limit);
    reply.code(200);
    reply.headers({ 'Content-Type': 'application/json' });
    reply.send(articles);
  } catch (error) {
    handleError(reply, error);
  }
};

export const getArticleHandler = async (request, reply) => {
  try {
    const { id } = request.params;
    const article = await usecase.getArticle(id);
    reply.code(200);
    reply.headers({ 'Content-Type': 'application/json' });
    reply.send(article);
  } catch (error) {
    handleError(reply, error);
  }
};

export const addArticleHandler = async (req, reply) => {
  try {
    const { articleTitle, content, userId } = req.body;
    await usecase.addArticle(articleTitle, content, userId);
    reply.send(JSON.stringify({ message: 'Article added' }));
  } catch (error) {
    handleError(reply, error);
  }
};

export const updateArticleHandler = async (req, reply) => {
  try {
    const { articleTitle, content, tagId } = req.body;
    const { id } = req.params;
    await usecase.updateArticle(id, articleTitle, content, tagId);
    reply.send(JSON.stringify({ message: 'Article updated' }));
  } catch (error) {
    handleError(reply, error);
  }
};
