import Fastify from 'fastify'
import mysql from 'mysql2/promise' 
import cors from '@fastify/cors'
import argon2 from 'argon2'
import cookie from '@fastify/cookie'     
import session from '@fastify/session'

const fastify = Fastify({ logger: true })

await fastify.register(cors, {
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})
await fastify.register(cookie)

await fastify.register(session, {
    secret: 'kono-himitsu-kagi-wa-32-moji-ijou-hitsuyou-desu',  // 32文字以上の秘密の鍵
    cookie: {
    secure: false,                       
    httpOnly: true,                      
    maxAge: 1000 * 60 * 60 * 24           
  }
})

// DB接続設定
const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'my_analysis_db'
}

// 記事一覧を取得するルート
fastify.get('/articles', async (request, reply) => {
  const connection = await mysql.createConnection(dbConfig)
  const [rows] = await connection.execute('SELECT * FROM articles ORDER BY created_at DESC LIMIT 6')
  await connection.end()
  return rows
})

fastify.get('/articles/:id', async (request, reply) => {
  const { id } = request.params
  const connection = await mysql.createConnection(dbConfig)
  

  const [rows] = await connection.execute('SELECT * FROM articles WHERE id = ?', [id])
  
  await connection.end()

  if (rows.length === 0) {
    return reply.status(404).send({ error: '記事が見つかりません' })
  }

  return rows[0]
})

fastify.put('/articles/:id', async (request, reply) => {
  const { id } = request.params
  const { article_title, content } = request.body             

  // 認証チェック
  if (!request.session.user) {
    return reply.status(401).send({ error: 'ログインが必要です' })
  }

  const connection = await mysql.createConnection(dbConfig)


  const [rows] = await connection.execute(
    'SELECT user_id FROM articles WHERE id = ?',
    [id]
  )
  const article = rows[0]  


  if (!article) {
    await connection.end()
    return reply.status(404).send({ error: '記事が見つかりません' })
  }


  if (article.user_id !== request.session.user.user_id) {
    await connection.end()
    return reply.status(403).send({ error: '自分の記事のみ編集できます' })
  }

  const [result] = await connection.execute(
    'UPDATE articles SET article_title = ?, content = ? WHERE id = ?',
    [article_title, content, id]
  )
  await connection.end()

  return {
    message: '記事を更新しました',
    data: { id, article_title, content }
  }
})                                                              

// 記事を削除するルート（DELETE）
fastify.delete('/articles/:id', async (request, reply) => {
  const { id } = request.params

  const connection = await mysql.createConnection(dbConfig)

  const [result] = await connection.execute(
    'DELETE FROM articles WHERE id = ?',
    [id]
  )

  await connection.end()

  if (result.affectedRows === 0) {
    return reply.status(404).send({ error: '記事が見つかりません' })
  }

  return { message: '記事を削除しました' }
})

// ★追加：記事を新規作成するルート（POST）
fastify.post('/articles', async (request, reply) => {
  const { article_title, content, user_id } = request.body

  // ② DB接続
  const connection = await mysql.createConnection(dbConfig)

  // ③ INSERT文を実行
  const [result] = await connection.execute(
    'INSERT INTO articles (article_title, content, user_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
    [article_title, content, user_id]
  )

  // ④ DB接続を閉じる
  await connection.end()

  // ⑤ INSERTのresultには「自動採番された新しいid」が入っている
  return reply.status(201).send({
    message: '記事を作成しました',
    data: {
      id: result.insertId,         // ← DBが付けた新しい番号
      article_title,
      content,
      user_id
    }
  })
})

// ユーザー新規登録ルート（POST）
fastify.post('/users', async (request, reply) => {
  const { user_id, password, user_name } = request.body

  //必須フィールドのバリデーション
  if (!user_id || !password || !user_name) {
    return reply.status(400).send({
      error: 'user_id, password, user_name は必須です'
    })
  }
  const connection = await mysql.createConnection(dbConfig)

  // user_id の重複チェック
  const [existing] = await connection.execute(
    'SELECT user_id FROM users WHERE user_id = ?',
    [user_id]
  )
  if (existing.length > 0) {
    await connection.end()
    return reply.status(409).send({
      error: 'この user_id は既に使われています'
    })
  }
  const hashedPassword = await argon2.hash(password)

  const [result] = await connection.execute(
    'INSERT INTO users (user_id, password, user_name) VALUES (?, ?, ?)',
    [user_id, hashedPassword, user_name]
  )
  await connection.end()
  // ⑦ 成功レスポンス
  return reply.status(201).send({
    message: 'ユーザー登録が完了しました',
    data: {
      id: result.insertId,
      user_id,
      user_name
    }
  })
})

fastify.post('/login', async (request, reply) => {
  const { user_id, password } = request.body

  if (!user_id || !password) {
    return reply.status(400).send({ error: 'user_id と password は必須です' })
  }
  
  const connection = await mysql.createConnection(dbConfig)
  const [rows] = await connection.execute(
    'SELECT * FROM users WHERE user_id = ?',  
    [user_id]
  )
  await connection.end()

  const user = rows[0]   

  if (!user || !user.password) {
    return reply.status(401).send({ error: 'ユーザーIDまたはパスワードが正しくありません' })
  }

  const isValid = await argon2.verify(user.password, password)
  if (!isValid) {
    return reply.status(401).send({ error: 'ユーザーIDまたはパスワードが正しくありません' })
  }

  request.session.user = {
    user_id: user.user_id,
    user_name: user.user_name
  }
  return {
    message: 'ログインしました',
    data: { user_id: user.user_id, user_name: user.user_name }
  }
})
fastify.get('/me', async (request, reply) => {
  if (!request.session.user) {
    return reply.status(401).send({ error: 'ログインしていません' })
  }
  return { data: request.session.user }
})
fastify.post('/logout', async (request, reply) => {
  request.session.destroy()
  return { message: 'ログアウトしました' }
})

fastify.get('/users/:id', async (request, reply) => {
  const {id} = request.params;
  const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
        'SELECT user_id, user_name FROM users WHERE user_id = ?',
        [id]
    );
    await connection.end();

    if (rows.length === 0) {
        return reply.status(404).send({ error: 'ユーザーが見つかりません' });
    }

    return rows[0];
    });

fastify.put('/users/:id', async (request, reply) => {
  const { id } = request.params;
  const { user_name } = request.body;

  if(!request.session.user){
    return reply.status(401).send({ error: 'ログイン必須' });
  }

  if(request.session.user.user_id !== id){
    return reply.status(403).send({ error: '自分のプロフィールのみ編集可能' });
  }

  if (!user_name) {
    return reply.status(400).send({ error: 'user_name は必須です' });
  }

  const connection = await mysql.createConnection(dbConfig);
  const [result] = await connection.execute(
    'UPDATE users SET user_name = ? WHERE user_id = ?',
    [user_name, id]
  );
  await connection.end();

  if (result.affectedRows === 0) {
    return reply.status(404).send({ error: 'ユーザーが見つかりません' });
  }

  return { 
    message: 'プロフィールが更新されました', 
    data: { user_id: id, user_name } 
  }
})



const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    console.log("Server is running at http://localhost:3000")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

