async function contentRoutes(fastify) {
  fastify.get("/api/content", async (request, reply) => {
    const { contentId } = request.query;

    try {
      const [contentRow] = await fastify.db.query(
        "SELECT * FROM contents WHERE id=?",
        [contentId]
      );

      return reply.send({ content: contentRow[0] });
    } catch (err) {
      return reply.status(500).send({
        error:
          "コンテンツ情報を取得できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.get("/api/content/text", async (request, reply) => {
    const { contentId } = request.query;

    try {
      const [textBodyRow] = await fastify.db.query(
        "SELECT body FROM content_texts WHERE content_id=?",
        [contentId]
      );

      return reply.send({ textBody: textBodyRow[0].body });
    } catch (err) {
      return reply.status(500).send({
        error:
          "コンテンツ情報を取得できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.get("/api/content/quiz", async (request, reply) => {
    const { contentId } = request.query;

    try {
      const [questionRow] = await fastify.db.query(
        "SELECT id AS question_id,body FROM questions WHERE content_id=?",
        [contentId]
      );
      const questionBody = questionRow[0].body;
      const questionId = questionRow[0].question_id;

      const [choiceRow] = await fastify.db.query(
        "SELECT body_choice,is_answer FROM choices WHERE question_id=? ORDER BY choice_number",
        [questionId]
      );
      return reply.send({ questionBody, choiceRow });
    } catch (err) {
      return reply.status(500).send({
        error:
          "コンテンツ情報を取得できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });
}

export default contentRoutes;
