export default async function (fastify, opts) {
  fastify.get("/", async (request, reply) => {
    const userName = request.getUserName();

    const sql = `
      SELECT 
        a.title,
        a.content,
        a.article_id,
        a.created_at,
        a.image_path,
        t.tag_name,
        u.user_name
      FROM articles AS a 
      INNER JOIN tags AS t ON a.tag_id = t.tag_id 
      INNER JOIN users AS u ON a.user_id = u.user_id 
      ORDER BY a.created_at DESC
      LIMIT 6;`;

    const [articlelist] = await fastify.toppagePool.execute(sql);

    return reply.view("index.ejs", {
      userName,
      articlelist,
    });
  });
}
