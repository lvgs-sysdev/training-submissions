// ESMで書いてる
// fastify関連のフレームワークやプラグインモジュールの読み込み
const fastify = require('fastify')({ logger: true });
const path = require('path');
const fastifyStatic = require('@fastify/static');
const session = require('@fastify/session');
const cookie = require('@fastify/cookie');
const formbody = require('@fastify/formbody');

// mysql2の読み込み
const mysql = require('mysql2/promise');
const { register } = require('module');

// databaseとの繋ぎこみ
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'twitterz',
  connectionLimit: 10,
  namedPlaceholders: true
});

// ミドルウェア関数の使用
// publicをルートファイルとして指定、かつpublic内にあるデータを転送
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public',
});

// sessionの登録とオプション設定
fastify.register(cookie);
fastify.register(session, {
  secret: 'a secret with minimum length of 32 characters',
  cookie: {
    secure: false,
    expires: undefined
  },
  // cookieにセッションを保存するための設定
  saveUninitialized: false
});

fastify.register(formbody);

// ルーティングで表示するページを指定
// 投稿一覧画面
fastify.get('/', (req, reply) => {
  if (req.session.user) {
    reply.sendFile('/views/tsueeet.html');
  } else {
    reply.redirect('/login');
  }
});

fastify.get('/allPosts', async (req, reply) => {
  if (req.session.user === "NinjaWanko") {
    try {
      const [allPosts] = await pool.query(
        'SELECT * FROM posts WHERE tsueeet_delete = 0 ORDER BY posted_date DESC'
      );
      console.log(allPosts);
      reply.send({allPosts});
    } catch (err) {
      console.log('Something Wrong');
    }
  } else {
    reply.redirect('/');
  }
});

// 投稿作成画面
fastify.get('/tsueeet', (req, reply) => {
  if (req.session.user) {
    reply.sendFile('/views/post.html');
    console.log(req.session.user);
  } else {
    reply.redirect('/login');
  }
});

// 以下のコードでセッションに合わせたルーティングができる
// fastify.get('/profile', (req, reply) => {
//   if(req.session.user) {
//     reply.sendFile(`/views/${req.session.user}.html`);
//     console.log(req.session.user);
//   } else {
//     reply.redirect('/login');
//   }
// });

// プロフィール画面
fastify.get('/profile', (req, reply) => {
  if (req.session.user) {
    reply.sendFile(`/views/profile.html`);
    console.log(req.session.user);
  } else {
    reply.redirect('/login');
  }
});

fastify.get('/login', (req, reply) => {
  reply.sendFile('/views/login.html');
});

fastify.get('/signup', (req, reply) => {
  reply.sendFile('/views/signup.html');
});

fastify.get('/registered', (req, reply) => {
  reply.sendFile('/views/success-signup.html');
});

fastify.get('/failedLogin', (req, reply) => {
  reply.sendFile('/views/failed-login.html');
});

// バリデーションによって不要だが一応
fastify.get('/failedSignup', (req, reply) => {
  reply.sendFile('/views/failed-signup.html');
});

// 新規登録の処理
fastify.post('/signup', (req, reply) => {
  const { username, user_id, password } = req.body;

  try {
    if (
      username.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)
      && username.length <= 16
      && user_id.match(/^[A-Za-z0-9]+$/)
      && username.length <= 16
      && password.match(/^(?=.*?[A-Za-z])(?=.*?[A-Z0-9])/)
      && password.length <= 16
    ) {
      pool.query(
        'INSERT INTO users(user_id, username, password) VALUES (:user_id, :username, :password)',
        ({user_id: user_id, username: username, password: password})
      );
      reply.redirect('/registered');
    } else {
      reply.redirect('/failefSignup');
    }
  } catch (err) {
    throw err;
  }
});

// ログインの処理およびセッションの発行
fastify.post('/login', async (req, reply) => {
  const { user_id, password } = req.body;

  try {
    const [resultRows] = await pool.query(
      'SELECT * FROM users WHERE user_id = :user_id',
    {user_id: user_id});
    
    if (password === resultRows[0].password) {
        req.session.user = user_id;
        reply.redirect('/');
      } else {
        console.log("Wrong password");
        reply.redirect('/failedLogin');
      }
  } catch(err) {
    throw err;
  }
});

// サーバーを動かす
fastify.listen({ port: 3001 }, (err) => {
  if (err) {
    console.error('サーバーの起動中にエラーが発生しました:', err);
    process.exit(1);
  }
  console.log('サーバーがポート3001で起動しました');
});