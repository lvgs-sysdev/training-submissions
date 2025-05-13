// ESMで書いてる
// nodeにあるモジュール
const fs = require('fs');
const util = require('util');
const { pipeline } = require('stream');

// fastify関連のフレームワークやプラグインモジュールの読み込み
const fastify = require('fastify')({ logger: true });
const path = require('path');
const fastifyStatic = require('@fastify/static');
const session = require('@fastify/session');
const cookie = require('@fastify/cookie');
const formbody = require('@fastify/formbody');
const multipart = require('@fastify/multipart');

// mysql2の読み込み
const mysql = require('mysql2/promise');

// 暗号化モジュール
const crypto = require('crypto');

// database接続
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'twitterz',
  connectionLimit: 10,
  namedPlaceholders: true,
  timezone: 'jst'
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
    expires: undefined,
    httpOnly: true
  },
  // cookieにセッションを保存するための設定
  saveUninitialized: false
});

fastify.register(formbody);
fastify.register(multipart);

const pump = util.promisify(pipeline);

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
  if (req.session.user) {
    try {
      const [allPosts] = await pool.query(
        'SELECT posts.user_id, posts.tsueeet_content, posts.posted_date, users.username, users.profile_icon FROM posts INNER JOIN users ON posts.user_id = users.user_id WHERE posts.tsueeet_delete = 0 ORDER BY posts.posted_date DESC'
      );
      reply.send({ allPosts });
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
  } else {
    reply.redirect('/login');
  }
});

fastify.post('/tsueeet', (req, reply) => {
  const tsueeeted = req.body.tsueeet;
  try {
    pool.query(
      'INSERT INTO posts(user_id, tsueeet_content) VALUES (:user_id, :tsueeet_content)',
      { user_id: req.session.user, tsueeet_content: tsueeeted }
    );
    reply.redirect('/');
  } catch (err) {
    throw err;
  }
});

// 以下のコードでセッションに合わせたルーティングができる
// 他人のプロフィール閲覧画面
fastify.get('/others/:user_id', (req, reply) => {
  if (req.session.user) {
    // const userProfile = req.params.user_id;
    reply.sendFile('/views/others-profile.html');
  } else {
    reply.redirect('/login');
  }
});

fastify.get('/others-profile', async (req, reply) => {
  if (req.session.user) {
    const [othersProfileData] = await pool.query(
      'SELECT user_id, username, user_bio, profile_icon FROM users'
    );
    reply.send({ othersProfileData });
  }
});

// プロフィール画面
fastify.get('/profile', (req, reply) => {
  if (req.session.user) {
    reply.sendFile(`/views/profile.html`);
  } else {
    reply.redirect('/login');
  }
});

// アカウント情報の編集
fastify.post('/profile', async (req, reply) => {
  const parts = req.files();

  if (req.session.user) {
    const imgRooting = `./public/images/${req.session.user}.png`;

    for await (const part of parts) {
      const editProfileIcon = part.filename;
      const editUsername = part.fields?.edit_username?.value;
      const editBio = part.fields?.edit_bio?.value;

      if (editProfileIcon !== '') {
        await pump(part.file, fs.createWriteStream(imgRooting));
        await pool.query(
          'UPDATE users SET profile_icon = :profile_icon WHERE user_id= :user_id',
          { profile_icon: imgRooting, user_id: req.session.user }
        );
      }

      if (
        editUsername != undefined
        && editUsername !== ''
        && editUsername.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)
        && editUsername.length <= 16
      ) {
        await pool.query(
          'UPDATE users SET username = :username WHERE user_id= :user_id',
          { username: editUsername, user_id: req.session.user }
        )
      }

      if (
        editBio != undefined
        && editBio !== ''
        && editBio.length <= 100
      ) {
        await pool.query(
          'UPDATE users SET user_bio = :user_bio WHERE user_id= :user_id',
          { user_bio: editBio, user_id: req.session.user }
        )
      }
    }
    reply.redirect('/profile');
  } else {
    reply.redirect('/login');
  }
});

fastify.get('/profileData', async (req, reply) => {
  if (req.session.user) {
    try {
      const iAmUser = req.session.user;
      const [userDataRows] = await pool.query(
        'SELECT user_id, username, profile_icon, user_bio FROM users WHERE user_id = :user_id',
        { user_id: iAmUser }
      );
      reply.send({ userDataRows });
    } catch (err) {
      console.log('Something Wrong');
    }
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
fastify.post('/signup', async (req, reply) => {
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
      const [checkDouble] = await pool.query(
        'SELECT * FROM users WHERE user_id = :user_id',
        { user_id: user_id }
      );

      if (checkDouble.length > 0) {
        reply.redirect('/failedSignup');
      } else {
        const hash = crypto.createHash('sha256').update(password).digest('hex');

        await pool.query(
          'INSERT INTO users(user_id, username, password) VALUES (:user_id, :username, :password)',
          ({ user_id: user_id, username: username, password: hash })
        );

        reply.redirect('/registered');
      }

    } else {
      reply.redirect('/failedSignup');
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
      { user_id: user_id }
    );

    const loginHash = crypto.createHash('sha256').update(password).digest('hex');

    if (loginHash === resultRows[0].password) {
      req.session.user = user_id;
      reply.redirect('/');
    } else {
      console.log("Wrong password");
      reply.redirect('/failedLogin');
    }
  } catch (err) {
    throw err;
  }
});

// サーバーを動かす
fastify.listen({ port: 3001 }, (err) => {
  if (err) {
    console.error('サーバーの起動中にエラーが発生しました:', err);
    process.exit(1);
  }
  console.log(`サーバーがポート${fastify.server.address().port}で起動しました`);
});