"use strict";

const fastify = require("fastify")({ logger: true });
const path = require("path");
const fastifyStatic = require("@fastify/static");
const db = require("./db/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fastifyCookie = require("@fastify/cookie");

const PROTECTED_PAGES = ['/edit-article.html', '/edit-profile.html'];

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

const getUserFromSession = async (sessionId) => {
  const [rows] = await db.query(`
    SELECT
    users.id,
    users.user_id
    FROM
    sessions
    JOIN
    users
    ON
    sessions.user_id = users.user_id
    WHERE
    sessions.session_id = :sessionId
    `,
    { sessionId: sessionId }
  );
  
  if (rows.length === 0) return null;
  
  return rows[0];
}

const getArticleAuthorId = async (articleId) => {
  const [rows] = await db.query(`
    SELECT
    user_id
    FROM
    articles
    WHERE
    id = :articleId
    `,
    { articleId: articleId }
  );
  
  if (rows.length === 0) return null;
  
  return rows[0].user_id;
}

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

fastify.register(fastifyCookie, {
  secret: "5f91c65bb4592370cc7f62fc66321d27edabf48a11ca89502bdb1b3e95169c64",
});

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

// articles全件を返すエンドポイント（更新日時が新しい順）
fastify.get("/articles", async () => {
  const [rows] = await db.query(
    "SELECT * FROM articles ORDER BY updated_at DESC"
  );
  
  return rows;
});

// URLから受け取ったidのarticleのデータと著者のデータを返すエンドポイント
fastify.get("/article/:id", async (request) => {
  const id = request.params.id;
  const [rows] = await db.query(
    `
    SELECT
    articles.id,
    articles.article_title,
    articles.genre,
    articles.content,
    articles.updated_at,
    articles.thumbnail_path,
    
    users.id AS user_pk_id,
    users.user_id,
    users.user_name,
    users.icon_path
    FROM
    articles
    INNER JOIN
    users ON articles.user_id = users.user_id
    WHERE
    articles.id = :id
    `,
    { id: id }
  );
  
  return rows[0];
});

// URLから受け取ったuser_idと一致するarticleのレコードを返すエンドポイント
fastify.get("/articles/:userId", async (request) => {
  const userId = request.params.userId;
  const [rows] = await db.query(
    `
    SELECT
      *
    FROM
      articles
    WHERE
      user_id = :userId
    `,
    { userId: userId }
  );

  return rows;
});

// PUTリクエストで受け取った内容にarticleを更新するエンドポイント
fastify.put(
  "/article/:id",
  { schema: updateArticleSchema },
  async (request, reply) => {
    const id = request.params.id;
    const sessionId = request.cookies.session_id;
    const { title, genre, content } = request.body;

    const targetArticleAuthorId = await getArticleAuthorId(id);
    const currentUser = await getUserFromSession(sessionId);

    if (!currentUser) {
      return reply.code(401).send({ message: 'ログインしてください。' });
    }

    const currentUserId = currentUser.user_id;

    if (String(targetArticleAuthorId) !== String(currentUserId)) {
      return reply.code(403).send({ message: '権限がありません。' })
    }

    try {
      const [result] = await db.query(
        `
      UPDATE
        articles
      SET
        article_title = :title,
        genre = :genre,
        content = :content,
        updated_at = NOW()
      WHERE
        id = :id
      `,
        {
          title: title,
          genre: genre,
          content: content,
          id: id,
        }
      );
      if (result.affectedRows === 1) {
        return { success: true, id: id };
      } else {
        // 更新対象が見つからなかった場合
        reply.code(404).send({ success: false, message: "記事が見つかりませんでした。" });
      }
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ success: false, message: "記事の更新に失敗しました。" });
    }
  }
);

// ユーザー全件を返すエンドポイント
fastify.get("/users", async () => {
  const [rows] = await db.query(`
    SELECT
      id,
      user_id,
      user_name,
      icon_path
    FROM
      users
    `);

  return rows;
});

// URLから受け取ったidと一致するユーザーを返すエンドポイント
fastify.get("/user/:id", async (request) => {
  const id = request.params.id;
  const [rows] = await db.query(
    `
    SELECT
      id,
      user_id,
      user_name,
      icon_path
    FROM
      users
    WHERE
      id = :id
    `,
    { id: id }
  );

  return rows[0];
});

// PUTリクエストで受け取った内容にuserを更新するエンドポイント
fastify.put(
  "/user/:id",
  { schema: updateUserSchema },
  async (request, reply) => {
    const sessionId = request.cookies.session_id;
    const id = request.params.id;
    const { user_id: userId, user_name: userName } = request.body;
    
    const currentUser = await getUserFromSession(sessionId);

    if (!currentUser) {
      return reply.code(401).send({ message: 'ログインしてください。' });
    }

    const currentUserId = currentUser.id;

    if (String(id) !== String(currentUserId)) {
      return reply.code(403).send({ message: '権限がありません。' })
    }

    try {
      const [result] = await db.query(
        `
      UPDATE
        users
      SET
        user_id = :userId,
        user_name = :userName
      WHERE
        id = :id
      `,
        {
          userId: userId,
          userName: userName,
          id: id,
        }
      );
      if (result.affectedRows === 1) {
        return { success: true, id: id };
      } else {
        // 更新対象が見つからなかった場合
        reply.code(404).send({ success: false, message: "ユーザーが見つかりませんでした。" });
      }
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ success: false, message: "プロフィールの更新に失敗しました。" });
    }
  }
);

fastify.post("/register", async (request, reply) => {
  const { userId, password, userName } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const [result] = await db.query(
      `
      INSERT INTO
        users
        (user_id, password, user_name)
      VALUES
        (:userId, :hashedPassword, :userName)
      `,
      {
        userId: userId,
        hashedPassword: hashedPassword,
        userName: userName,
      }
    );
    if (result.affectedRows === 1) {
      reply.code(201).send({ success: true, id: result.insertId });
    }
  } catch (error) {
    request.log.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      reply.code(409).send({
        success: false,
        message: "そのユーザーIDはすでに使用されています。",
      });
    } else {
      reply.code(500).send({ success: false, message: "ユーザーの登録に失敗しました。" });
    }
  }
});

fastify.post("/login", async (request, reply) => {
  const { userId, password } = request.body;

  try {
    const [rows] = await db.query(
      `
      SELECT
        *
      FROM
        users
      WHERE
        user_id = :userId
      `,
      { userId: userId }
    );

    const user = rows[0];

    if (!user) {
      return reply.code(401).send({ success: false, message: "ユーザーIDまたはパスワードが間違っています。" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return reply.code(401).send({ success: false, message: "ユーザーIDまたはパスワードが間違っています。" });
    } else {
      const sessionId = crypto.randomUUID();

      await db.query(`
        INSERT INTO
          sessions
          (session_id, user_id)
        VALUES
          (:sessionId, :userId)
          `,
        { sessionId: sessionId, userId: userId }
      );

      reply.setCookie("session_id", sessionId, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        secure: false,
        sameSite: "lax"
      });

      return reply.code(200).send({ success: true, message: "ログインに成功しました。" });
    }
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({ success: false, message: "ログインに失敗しました。" });
  }
});

fastify.get("/auth/me", async (request, reply) => {
  const sessionId = request.cookies.session_id;

  if (!sessionId) {
    return reply.code(401).send({ success: false, message: "ログインを行ってください。" });
  }

  try {
    const [rows] = await db.query(`
      SELECT
        users.id,
        users.user_id,
        users.user_name
      FROM
        sessions
      JOIN
        users
      ON
        sessions.user_id = users.user_id
      WHERE
        sessions.session_id = :sessionId
      `,
      { sessionId: sessionId }
    );
    const user = rows[0];
    
    if (!user) {
      reply.clearCookie('session_id', { path: '/'});
      return reply.code(401).send({ success: false, message: "セッションが切れています。恐れ入りますが、再度ログインを行ってください。"});
    }

    reply.code(200).send({ success: true, message: "ログイン済み。", id: user.id, userId: user.user_id, userName: user.user_name });
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({ success: false, message: 'エラーが発生しました。恐れ入りますが、しばらく時間をおいてアクセスしてください。'});
  }
})

fastify.post("/logout", async (request, reply) => {
  const sessionId = request.cookies.session_id;
  
  try{
    if (sessionId) {
      await db.query(`
        DELETE FROM
          sessions
        WHERE
          session_id = :sessionId
        `,
        { sessionId: sessionId }
      );
    }
  } catch (error) {
    request.log.error(error);
  }

  reply.clearCookie('session_id', { path: '/' });

  return { success: true };
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
