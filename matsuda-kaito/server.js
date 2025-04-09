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

// databaseとの繋ぎこみ　※ここは消しちゃダメ
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'twitterz',
//     connectionLimit: 10
// });

// pool.query(
//   'SELECT * FROM tsueeets',
//   (error, results) => {
//     console.log(results);
//   }
// );

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
fastify.get('/', (req, reply) => {
  if(req.session.user) {
    reply.sendFile('/views/tsueeet.html');
  } else {
    reply.redirect('/login');
  }
});

fastify.get('/tsueeet', (req, reply) => {
  if(req.session.user) {
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

fastify.get('/profile', (req, reply) => {
  if(req.session.user) {
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

// 新規登録の処理
fastify.post('/register', (req, reply) => {
  const { username, user_id, password} = req.body;
  
  if (username.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)) {
    console.log(username);
    console.log(req.body.username);
  } else {
    console.log('Not OK username');
  }
  if (user_id.match(/^[A-Za-z0-9]+$/)) {
    console.log(user_id);
    console.log(req.body.user_id);
  } else {
    console.log('Not OK user_id');
  }
  if (password.match(/^(?=.*?[A-Za-z])(?=.*?[A-Z0-9])/)) {
    console.log(password);
    console.log(req.body.password);
  } else {
    console.log('Not OK password');
  }
});

// テスト用なので消してよし ※動作確認済み
// ログインの処理およびセッションの発行
const users = [
  {user: 'yamada', password: 'yamada1'},
  {user: 'satou', password: 'satou1'},
  {user: 'tanaka', password: 'tanaka1'}
];

fastify.post('/trylogin', (req, reply) => {
  const { user_id, password } = req.body;
  console.log(user_id);

    for (let userdata of users) {
        if (userdata.user === user_id && userdata.password === password) {
            console.log("it's okay");
            req.session.user = user_id;
            console.log(req.session.user);
            reply.redirect('/');
            break;
        } else {
            console.log("it's wrong");
        }
    }
});
// ここまで同じ処理のテストで削除可

// サーバーを動かす
fastify.listen({ port: 3001 }, (err) => {
  if (err) {
    console.error('サーバーの起動中にエラーが発生しました:', err);
    process.exit(1);
  }
  console.log('サーバーがポート3001で起動しました');
});