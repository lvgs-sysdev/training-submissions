async function userRoutes(fastify) {
  fastify.post("/api/user", async (request, reply) => {
    const { sessionId } = request.body;

    try {
      const [authorizedUserRows] = await fastify.db.query(
        "SELECT * FROM sessions WHERE id=? AND expires_at>now()",
        [sessionId]
      );

      if (!authorizedUserRows || authorizedUserRows.length === 0) {
        return reply.status(401).send({
          error: "無効なセッションです。再度ログインしてください。",
          sessionId,
        });
      }

      const [loginUserRows] = await fastify.db.query(
        "SELECT id,user_name FROM users WHERE id=?",
        [authorizedUserRows[0].user_id]
      );

      const loginUser = {
        userId: loginUserRows[0].id,
        userName: loginUserRows[0].user_name,
      };

      return reply.status(200).send({ loginUser });
    } catch (err) {
      return reply.status(500).send({
        error:
          "ログイン情報を取得できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });
}

export default userRoutes;
