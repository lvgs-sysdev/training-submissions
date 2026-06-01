export const Article = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    articleTitle: { type: 'string' },
    content: { type: 'string' },
    userId: { type: 'string' },
    updateAt: { type: 'string' },
    tag: { type: 'string' },
  },
};

export const getArticlesSchema = {
  querystring: {
    type: 'object',
    properties: {
      limit: { type: 'integer' },
    },
  },
  response: {
    200: {
      type: 'array',
      items: Article,
    },
  },
};

export const getArticleSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: Article,
  },
};

export const addArticleSchema = {
  body: {
    type: 'object',
    required: ['articleTitle', 'content', 'userId'],
    properties: {
      articleTitle: { type: 'string' },
      content: { type: 'string' },
      userId: { type: 'string' },
    },
  },
  response: {
    201: { type: 'string' },
  },
};

export const updateArticleSchema = {
  body: {
    type: 'object',
    required: ['articleTitle', 'content', 'tagId'],
    properties: {
      articleTitle: { type: 'string' },
      content: { type: 'string' },
      tagId: { type: 'integer' },
    },
  },
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: { type: 'string' },
  },
};
