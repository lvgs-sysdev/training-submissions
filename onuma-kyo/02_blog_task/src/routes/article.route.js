import * as controller from '../controllers/article.controller.js';
import {
  getArticlesSchema,
  getArticleSchema,
  addArticleSchema,
  updateArticleSchema,
} from '../schemas/articles.js';

const getArticlesOpts = {
  schema: getArticlesSchema,
  handler: controller.getArticlesHandler,
};

const getArticleOpts = {
  schema: getArticleSchema,
  handler: controller.getArticleHandler,
};

const addArticleOpts = {
  schema: addArticleSchema,
  handler: controller.addArticleHandler,
};

const updateArticleOpts = {
  schema: updateArticleSchema,
  handler: controller.updateArticleHandler,
};

export function articleRoutes(fastify, options, done) {
  fastify.get('/articles', getArticlesOpts);
  fastify.get('/articles/:id', getArticleOpts);
  fastify.post('/articles/new', addArticleOpts);
  fastify.put('/articles/edit/:id', updateArticleOpts);

  done();
}
