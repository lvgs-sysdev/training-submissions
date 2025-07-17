const db = require("../db/db.js");

module.exports = async function (fastify) {
  //最新の記事情報を6つ取得する処理
  fastify.get("/articles", async (request, reply) => {
    try {
      const [rows] = await db.query("SELECT id, article_title, SUBSTRING(content, 1, 20) AS content, updated_at FROM articles ORDER BY updated_at DESC LIMIT 6");
      reply.send(rows);
    } catch (error) {
      request.log.error("DBからの最新記事のデータ取得に失敗しました:", error);
      reply.sendFile("error.html");
    }
  });

  fastify.get("/detail", (request, reply) => {
    reply.sendFile("detail.html");
  });

  //ユーザーがクリックした記事の情報を取得する処理
  fastify.get("/articleDetail", async (request, reply) => {
    const articleId = request.query.id;
    try {
      const [rows] = await db.query(`SELECT art.id, art.article_title, art.content, user.user_name, user.user_id FROM articles art INNER JOIN users user ON art.user_id = user.user_id where art.id = ?`, [articleId]);
      reply.send(rows[0]);
    } catch (error) {
      request.log.error("DBからのユーザーがクリックした記事データ取得に失敗しました:", error);
      reply.sendFile("error.html");
    }
  });

  fastify.get("/editBlog", (request, reply) => {
    if (request.session.user) {
      reply.sendFile("editBlog.html");
    } else {
      reply.redirect("/login");
    }
  });

  //記事の編集のために記事の情報を取得する処理
  fastify.get("/editBlogPage", async (request, reply) => {
    const articleId = request.query.id;
    if (request.session.user) {
      try {
        const [rows] = await db.query(`SELECT id, article_title, content FROM articles where id = ?`, [articleId]);
        reply.send(rows[0]);
      } catch (error) {
        request.log.error("DBからの記事データ取得に失敗しました:", error);
        reply.sendFile("error.html");
      }
    } else {
      reply.redirect("/login");
    }
  });

  //記事の編集処理
  fastify.post("/editBlog", async (request, reply) => {
    const articleTitle = request.body.articleTitle;
    const content = request.body.content.replace(/\n/g, '<br>');
    const articleId = request.body.id;
    let encodedMsg = "";
    if (request.session.user) {
      if (articleTitle.length > 255) {
        encodedMsg = encodeURIComponent("タイトルが255文字を超えています");
      } else if (content.length > 10000) {
        encodedMsg = encodeURIComponent("本文が10000文字を超えています");
      } else {
        try {
          const [result] = await db.query(`UPDATE articles set article_title = ?, content = ? where id = ?`, [articleTitle, content, articleId]);
          encodedMsg = encodeURIComponent("記事を保存しました");
        } catch (error) {
          request.log.error("記事の編集に失敗しました:", error);
          encodedMsg = encodeURIComponent("記事の編集に失敗しました");
        }
      }
      reply.redirect(`/detail?id=${articleId}&msg=${encodedMsg}`);
    } else {
      reply.redirect("/login");
    }
  });
}