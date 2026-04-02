export const userGET = async function (request, reply) {
  const fastify = request.server;
  const userName = request.getUserName();

  const sql = `
      SELECT 
        u.user_name,
        u.user_id
      FROM users AS u
      WHERE u.user_name = ?
      ;`;

  const [loginUser] = await fastify.loginPool.execute(sql, [userName]);

  const sql_travel = `
      SELECT 
        a.article_id,
        a.title
      FROM articles AS a
      INNER JOIN users AS u ON a.user_id = u.user_id
      WHERE u.user_name= ? AND a.tag_id =1
      ;`;
  const [Blog_travel] = await fastify.SelectArticlePool.execute(sql_travel, [
    userName,
  ]);
  console.log(Blog_travel, "travelのデータ取得");

  const sql_cullnary = `
      SELECT 
        a.article_id,
        a.title
      FROM articles AS a
      INNER JOIN users AS u ON a.user_id = u.user_id
      WHERE u.user_name= ? AND a.tag_id =2
      ;`;
  const [Blog_cullnary] = await fastify.SelectArticlePool.execute(
    sql_cullnary,
    [userName],
  );
  console.log(Blog_cullnary, "cullnaryのデータ取得");

  return reply.view("private/user.ejs", {
    loginUser,
    Blog_travel,
    Blog_cullnary,
  });
};
