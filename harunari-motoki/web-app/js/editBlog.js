export const editBlogGET = async function (request, reply) {
  const edit_article_id = Number(request.query.id);

  console.log("この記事のarticle_idは", edit_article_id);

  const sql = `
    SELECT
      a.article_id,
      a.title,
      a.content
    FROM articles AS a
    WHERE a.article_id = ?
    ;`;

  const [edit_article] = await fastify.detailpagePool.execute(sql, [
    edit_article_id,
  ]);
  console.log("編集する記事データ取得済");

  return reply.view("private/editBlog.ejs", {
    edit_article,
  });
};

export const editBlogPOST = async function (request, reply) {
  const { article_id, edit_title, edit_content } = request.body;

  console.log("editBlog_browser.jsからのデータ取得済");
  const sql_update = `
  UPDATE articles SET title = ?, content = ? WHERE article_id =?;
  `;

  const [rows2] = await fastify.UpdateArticlePool.execute(sql_update, [
    edit_title,
    edit_content,
    article_id,
  ]);

  console.log("最後のreturnの一歩手前");
  return reply.send({
    success: true,
    message: "記事更新成功",
  });
};
