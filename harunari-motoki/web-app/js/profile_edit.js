export default async function (fastify, opts) {
  fastify.get("/editUser", async (request, reply) => {
    const userName = request.getUserName();

    const sql = `
      SELECT 
        u.user_name,
        u.user_id
      FROM users AS u
      WHERE u.user_name = ?
      ;`;
    const [loginUser] = await fastify.loginPool.execute(sql, [userName]);

    return reply.view("profile_edit.ejs", {
      loginUser,
    });
  });

  fastify.post("/editUser", async (request, reply) => {
    const {
      Originaluser_ID,
      Originaluser_Name,
      Newuser_ID,
      Newuser_Name,
      password,
    } = request.body;

    if (!Newuser_ID && !Newuser_Name) {
      return reply.send({
        success: false,
        message: "ユーザ名とユーザIDが入力されていません",
        redirectUrl: "/editUser",
      });
    }

    const sql_cognit = `
    SELECT COUNT(*) AS count FROM users WHERE user_ID = ? AND password = ?
    `;
    const [rows] = await fastify.loginPool.execute(sql_cognit, [
      Originaluser_ID,
      password,
    ]);

    if (rows[0].count !== 1) {
      return reply.send({
        success: false,
        message: "パスワードが間違っています",
        redirectUrl: "/editUser",
      });
    }

    let finalID = Newuser_ID || Originaluser_ID;
    let finalName = Newuser_Name || Originaluser_Name;
    let Message = "更新しました";

    if (!Newuser_ID && Newuser_Name) Message = "ユーザ名を更新しました";
    if (Newuser_ID && !Newuser_Name) Message = "ユーザIDを更新しました";
    if (Newuser_ID && Newuser_Name)
      Message = "ユーザIDとユーザ名を更新しました";

    const sql_update = `
    UPDATE users SET user_id = ?, user_name = ? WHERE user_id =?;
    `;

    const [rows2] = await fastify.edituserPool.execute(sql_update, [
      finalID,
      finalName,
      Originaluser_ID,
    ]);

    request.session.user = { name: finalName };
    console.log(request.session.user.name, "をセッション情報として渡す");

    return reply.send({
      success: true,
      message: Message,
      redirectUrl: "/editUser",
    });
  });
}
