"use strict";

const fastify = require("fastify")({ logger: true });
const path = require("path");
const fastifyStatic = require("@fastify/static");
const fastifyCookie = require("@fastify/cookie");
require('dotenv').config();

const { getUserFromSession, getArticleAuthorId } = require("./utils/authHelper");

const PROTECTED_PAGES = ['/edit-article.html', '/edit-profile.html'];

// プラグイン登録
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET
});

// ルーティング登録
fastify.register(require('./routes/articles'));
fastify.register(require('./routes/auth'));
fastify.register(require('./routes/users'));

// フックの設定（認証が必要なページへのリクエストがあった場合に権限のあるユーザーかどうかを確認する）
fastify.addHook('onRequest', async (request, reply) => {
  const [currentPath, query] = request.url.split('?');
  const isProtected = PROTECTED_PAGES.includes(currentPath);

  if (!isProtected) return;

  const sessionId = request.cookies.session_id;

  if (!sessionId) return reply.redirect('/login.html');
  
  const user = await getUserFromSession(sessionId);

  if (!user) {
    reply.clearCookie('session_id', { path: '/' });
    return reply.redirect('/login.html')
  };

  const params = new URLSearchParams(query);
  const targetId = params.get('id');

  if (currentPath === '/edit-article.html') {
    const targetArticleAuthorId = await getArticleAuthorId(targetId);

    if (String(targetArticleAuthorId) !== String(user.user_id)) {
      return reply.redirect('/');
    }
  }

  if (currentPath === '/edit-profile.html') {

    if (String(targetId) !== String(user.id)) {
      return reply.redirect('/');
    }
  }
});

// サーバー起動
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
