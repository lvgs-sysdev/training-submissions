'use strict';

// 記事編集時
const updateArticleSchema = {
  body: {
    type: "object",
    required: ["title", "genre", "content"],
    properties: {
      title: { type: "string", maxLength: 255 },
      genre: { type: "string", maxLength: 20 },
      content: { type: "string", maxLength: 10000 },
    },
  },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" },
    },
  },
};

// プロフィール編集時
const updateUserSchema = {
  body: {
    type: "object",
    required: ["user_id", "user_name"],
    properties: {
      title: { type: "string", maxLength: 20 },
      user_name: { type: "string", maxLength: 255 },
    },
  },
  params: {
    type: "object",
    properties: {
      id: { type: "integer" },
    },
  },
};

module.exports = { updateArticleSchema, updateUserSchema };
