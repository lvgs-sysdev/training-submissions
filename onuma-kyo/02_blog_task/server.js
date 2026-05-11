// Import the framework and instantiate it
import Fastify from 'fastify';
import { createConnection } from './src/database.js';
import fastifyStatic from '@fastify/static';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import path from 'node:path';
import { userRoutes } from './src/routes/user.route.js';
import { articleRoutes } from './src/routes/article.route.js';
import { authRoutes } from './src/routes/auth.route.js';
import { tagRoutes } from './src/routes/tag.route.js';
import 'dotenv/config'; // 1. 最初に環境変数を読み込む
import { error } from 'node:console';
import { STATUS_CODES } from 'node:http';
import { UnauthorizedError } from './src/utils/customError.js';

const fastify = Fastify({ logger: true });

// --- 2. セッション・Cookieプラグインの登録 ---
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  cookieName: 'sessionId',
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1800000,
    secure: false, // FIXME: 本番環境ではtrueにしてHTTPSでのみクッキーが付与されるようにする
    sameSite: 'lax', // 同一サイトと他サイトからのリンク遷移（GET）リクエストの場合のみCookie送信
    httpOnly: true, // JavaScript からの直接の参照・操作を禁止
  },
});

// --- 3. グローバルフック・エラーハンドラー ---
// 認証チェックフック
// NOTE: Cookieを解析してセッションを復元する前に処理が走るのを避けるため、sessionより後ろでプログ員登録する
fastify.addHook('onRequest', async (req, reply) => {
  const url = req.url;
  // ログイン,ユーザー新規登録以外の非GETリクエストは、認証済か検証する
  if (req.method === 'GET' || req.url.startsWith('/login') || req.url.startsWith('/users/new')) {
    return;
  }
  const session = req.session;
  const user = session.user;
  if (!req.session?.user) {
    throw new UnauthorizedError('未認証のためこのエンドポイントを利用できません。');
  }
});

// ペイロード送信直前に走るHook（onSend）で、全レスポンスに共通で設定したいヘッダを設定
fastify.addHook('onSend', (req, reply, payload, done) => {
  // HSTS (HTTPS強制)
  // NOTE: 本番運用時はドメイン設定＆有効化
  // reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // ブラウザが勝手にファイルタイプを検知し実行しようとするのを防止
  reply.header('X-Content-Type-Options', 'nosniff');
  // script-src 'self': スクリプトを同じドメインからしか読み込ませない
  // img-src 'self': 画像を同じドメインからしか読み込ませない
  // frame-ancestors 'none': クリックジャッキング防止
  reply.header(
    'Content-Security-Policy',
    "script-src 'self'; img-src 'self'; frame-ancestors 'none';",
  );
  done();
});

// Fastifyのグローバルエラーハンドラーを利用して、ハンドリング一箇所に集中
fastify.setErrorHandler((err, request, reply) => {
  console.error('Error: ', err);
  reply.type('application/json').code(err.statusCode ?? 500);
  const message = err.statusCode && err.statusCode < 500 ? err.message : 'Internal Server Error';

  return {
    statusCode: err.statusCode,
    error: STATUS_CODES[err.statusCode],
    message: message,
  };
});

// --- 4. 静的ファイル・個別ルート ---
fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, 'public'),
  extensions: ['html'], // .html を補完して探す。ex.GET:/login→レスポンス:/login/index.html
});
fastify.get('/detail/:id(^\\d+)', async function handler(request, reply) {
  await reply.sendFile('/detail/index.html');
});
fastify.get('/editBlog/:id(^\\d+)', async function handler(request, reply) {
  await reply.sendFile('/editBlog/index.html');
});

// --- 5. APIルートの登録（全ての準備が整った最後） ---
fastify.register(userRoutes);
fastify.register(articleRoutes);
fastify.register(authRoutes);
fastify.register(tagRoutes);

// Run the server!
try {
  await fastify.listen({ port: 3000 }, () => {
    createConnection();
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
