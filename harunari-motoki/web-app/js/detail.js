export default async function (fastify, opts) {
  fastify.get("/detail", async (request, reply) => {
    const detailarticle_id = Number(request.query.id);
    const userName = request.getUserName();

    console.log("この記事のarticle_idは" + detailarticle_id);

    const sql_detailarticle = `
      SELECT
        a.created_at,
        u.iconimage_path,
        u.user_name,
        u.twitter_path,
        u.instagram_path,
        u.linkedin_path,
        u.link_path,
        a.title,
        a.content,
        a.image_path,
        a.image_caption,
        t.tag_name,
        t.tag_id
      FROM articles AS a
      INNER JOIN users AS u ON a.user_id = u.user_id
      INNER JOIN tags AS t ON a.tag_id = t.tag_id
      WHERE a.article_id = ?
      ;`;

    const [detailarticle] = await fastify.detailpagePool.execute(
      sql_detailarticle,
      [detailarticle_id],
    );
    console.log("メインの記事データ取得済");

    const sql_detailimage = `
      SELECT
        detailimage_path
      FROM article_images
      WHERE article_id = ?
      ORDER BY display_order ASC
      ;`;

    const [detailimage] = await fastify.detailpagePool.execute(
      sql_detailimage,
      [detailarticle_id],
    );
    console.log("メインの記事の画像取得済");

    const sql_newarticle = `
      SELECT
        a.title,
        a.created_at,
        a.article_id,
        t.tag_name,
        a.image_path
      FROM articles AS a
      INNER JOIN tags AS t ON a.tag_id = t.tag_id
      WHERE a.article_id != ?
      ORDER BY created_at DESC
      LIMIT 3
      ;`;
    const [newarticle] = await fastify.detailpagePool.execute(sql_newarticle, [
      detailarticle_id,
    ]);
    console.log("新着の記事データ取得済");

    const sql_contributor = `
      SELECT
        u.user_name,
        u.iconimage_path
      FROM articles AS a
      INNER JOIN users AS u ON a.user_id = u.user_id
      GROUP BY u.user_id 
      ORDER BY count(a.article_id) DESC 
      LIMIT 5
      ;`;

    const [contributors] =
      await fastify.detailpagePool.execute(sql_contributor);
    console.log("投稿者のデータ取得済");

    const sql_relatedarticles = `
      SELECT
        a.image_path,
        a.created_at,
        t.tag_name,
        a.title,
        a.content,
        a.article_id
      FROM articles AS a
      INNER JOIN tags AS t ON a.tag_id = t.tag_id
      WHERE t.tag_id = ?
      ORDER BY RAND() 
      LIMIT 2
      ;`;

    const [relatedarticles] = await fastify.detailpagePool.execute(
      sql_relatedarticles,
      [detailarticle[0].tag_id],
    );
    console.log("関連記事のデータ取得済");

    return reply.view("detail.ejs", {
      userName,
      detailarticle,
      detailimage,
      newarticle,
      contributors,
      relatedarticles,
    });
  });
}
