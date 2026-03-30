async function courseRoutes(fastify) {
  fastify.get("/api/course", async (request, reply) => {
    const { userId, orderByRating, filteredByFavorite } = request.query;

    try {
      if (filteredByFavorite === "true") {
        const [courseRows] = await fastify.db.query(
          "SELECT c.id,c.course_name,c.thumbnail,c.course_description,c.user_id,c.updated_at,u.user_name FROM courses AS c INNER JOIN stars s ON c.id=s.course_id JOIN users u ON c.user_id=u.id WHERE s.user_id=? AND c.published=1 ORDER BY updated_at",
          [userId]
        );

        return reply.send({ courses: courseRows });
      }

      if (!!userId) {
        const [courseRows] = await fastify.db.query(
          "SELECT c.id,c.course_name,c.thumbnail,c.course_description,c.user_id,c.updated_at,u.user_name FROM courses AS c INNER JOIN enrollments e ON c.id=e.course_id JOIN users u ON c.user_id=u.id WHERE e.user_id=? AND c.published=1 ORDER BY updated_at",
          [userId]
        );

        return reply.send({ courses: courseRows });
      }

      if (orderByRating === "true") {
        const [courseRows] = await fastify.db.query(
          "SELECT c.id,c.course_name,c.thumbnail,c.course_description,c.user_id,c.updated_at, COUNT(e.user_id) AS rating, u.user_name FROM courses c LEFT JOIN enrollments e ON c.id=e.course_id JOIN users u ON c.user_id=u.id WHERE c.published=1 GROUP BY c.id,c.course_name,c.thumbnail,c.course_description,c.user_id,c.updated_at,u.user_name ORDER BY rating,updated_at"
        );

        return reply.send({ courses: courseRows });
      }
      const [courseRows] = await fastify.db.query(
        "SELECT c.id,c.course_name,c.thumbnail,c.course_description,c.user_id,c.updated_at,u.user_name FROM courses c JOIN users u ON c.user_id=u.id WHERE published=1 ORDER BY updated_at"
      );

      return reply.send({ courses: courseRows });
    } catch (err) {
      console.log(err)
      return reply.status(500).send({
        error:
          "コース情報を取得できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.get("/api/course/selected", async (request, reply) => {
    const { userId, courseId } = request.query;

    try {
      const [courseRows] = await fastify.db.query(
        "SELECT c.id,c.course_name,c.thumbnail,c.course_description,c.user_id,c.updated_at,u.user_name FROM courses c JOIN users u ON c.user_id=u.id WHERE c.id=? AND c.published=1",
        [courseId]
      );

      const course = courseRows[0];

      if (!userId) {
        return reply.send({ course });
      }

      const [isEnrolledRows] = await fastify.db.query(
        "SELECT EXISTS(SELECT 1 FROM enrollments WHERE user_id=? AND course_id=?) AS is_enrolled",
        [userId, courseId]
      );

      course.isEnrollment = isEnrolledRows[0].is_enrolled === 1 ? true : false;

      const [isStarRows] = await fastify.db.query(
        "SELECT EXISTS(SELECT 1 FROM stars WHERE user_id=? AND course_id=?) AS is_star",
        [userId, courseId]
      );

      course.isStar = isStarRows[0].is_star === 1 ? true : false;

      return reply.send({ course: courseRows[0] });
    } catch (err) {
      return reply.status(500).send({
        error:
          "コース情報を取得できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.get("/api/course/details", async (request, reply) => {
    const { courseId, userId } = request.query;

    try {
      const [courseDetailsRow] = await fastify.db.query(
        "SELECT s.id AS section_id,s.section_name,s.section_number,CONCAT('[',GROUP_CONCAT(JSON_OBJECT('content_id',c.id,'content_name',c.content_name,'content_number',c.content_number) ORDER BY c.content_number ASC SEPARATOR ','),']') AS contents FROM sections s LEFT JOIN contents c ON s.id=c.section_id WHERE course_id=? GROUP BY s.id,s.section_name,s.section_number ORDER BY s.section_number",
        [courseId]
      );

      const [completedRow] = await fastify.db.query(
        "SELECT content_id,user_id FROM completions WHERE user_id=?",
        [userId]
      );

      const completedContents = completedRow.map((item) => item.content_id);

      let completedContentIdRow = [];

      const contentRows = courseDetailsRow.map((item) =>
        JSON.parse(item.contents)
      );
      contentRows.reverse();

      for (const items of contentRows) {
        items.reverse();

        for (const item of items) {
          if (completedContents.includes(item.content_id)) {
            completedContentIdRow.push(item.content_id);
          }
        }
      }

      return reply.send({
        courseDetails: courseDetailsRow,
        completedContentIdRow,
      });
    } catch (err) {
      return reply.status(500).send({
        error:
          "コースの詳細情報を取得できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.post("/api/course", async (request, reply) => {
    const { userId, courseId } = request.body;

    try {
      const [authorId] = await fastify.db.query(
        "SELECT user_id FROM courses WHERE id=?",
        [courseId]
      );

      if (authorId[0].user_id === userId) {
        return reply
          .code(400)
          .send({ error: "自分が作成したコースは登録できません。" });
      }

      await fastify.db.query(
        "INSERT INTO enrollments (user_id,course_id) values (?,?)",
        [userId, courseId]
      );
      return reply.send({ msg: "登録が完了しました。" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return reply.code(409).send({ error: "既に登録しています。" });
      }
      return reply.status(500).send({
        error: "登録できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.delete("/api/course", async (request, reply) => {
    const { userId, courseId } = request.body;

    try {
      await fastify.db.query(
        "DELETE FROM enrollments WHERE user_id=? AND course_id=?",
        [userId, courseId]
      );
      return reply.send({ msg: "登録の解除が完了しました。" });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({
        error:
          "登録の解除ができませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.put("/api/course/details/complete", async (request, reply) => {
    const { userId, contentId } = request.body;

    try {
      await fastify.db.query(
        "INSERT INTO completions (user_id,content_id) VALUES (?,?)",
        [userId, contentId]
      );
      return reply.send({ msg: "コンテンツの受講を完了しました。" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return reply
          .status(200)
          .send({ msg: "このコンテンツは受講済みです。" });
      }
      return reply.status(500).send({
        error:
          "コンテンツの受講が完了しませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.get("/api/lecture/course", async (request, reply) => {
    const { userId } = request.query;

    try {
      const [courseRows] = await fastify.db.query(
        "SELECT c.id,c.course_name,c.course_description,c.thumbnail,u.user_name,c.published FROM courses c LEFT JOIN users u ON c.user_id=u.id WHERE user_id=?",
        [userId]
      );
      return reply.status(200).send({ courses: courseRows });
    } catch (err) {
      return reply.status(500).send({
        error:
          "コンテンツの取得に失敗しました。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.get("/api/lecture/course/selected", async (request, reply) => {
    const { courseId } = request.query;

    try {
      const [lectureItemRows] = await fastify.db.query(
        "SELECT id AS course_id,course_name,course_description,thumbnail FROM courses WHERE id=?",
        [courseId]
      );

      const [contentRows] = await fastify.db.query(
        "SELECT c.id AS content_id, c.content_name, c.content_type, c.content_number, s.id AS section_id, s.section_name FROM contents c JOIN sections s ON c.section_id = s.id WHERE s.course_id = ? ORDER BY s.id, c.content_number",
        [courseId]
      );

      const groupedLectures = {};

      for (const row of contentRows) {
        const { section_id, section_name, content_id, content_name, content_type } = row;

        if (!groupedLectures[section_id]) {
          groupedLectures[section_id] = {
            section_id,
            section_name,
            contents: [],
          };
        }

        if (content_type === "text") {
          const [textRows] = await fastify.db.query(
            "SELECT body FROM content_texts WHERE content_id=?",
            [content_id]
          );
          groupedLectures[section_id].contents.push({
            content_id,
            content_name,
            body: textRows[0]?.body || "",
            content_type: "text",
          });
        } else if (content_type === "quiz") {
          const [qRows] = await fastify.db.query(
            "SELECT id AS question_id, body FROM questions WHERE content_id=?",
            [content_id]
          );
          const questionId = qRows[0]?.question_id;
          const questionBody = qRows[0]?.body || "";
          let choice_body = ["", "", "", ""];
          let answer_idx = 0;
          if (questionId) {
            const [choices] = await fastify.db.query(
              "SELECT choice_number, body_choice, is_answer FROM choices WHERE question_id=? ORDER BY choice_number",
              [questionId]
            );
            choice_body = choices.map((c) => c.body_choice);
            const ansIndex = choices.findIndex((c) => c.is_answer === 1);
            answer_idx = ansIndex >= 0 ? ansIndex : 0;
          }
          groupedLectures[section_id].contents.push({
            content_id,
            content_name,
            body: questionBody,
            content_type: "quiz",
            question_id: questionId || -1,
            choice_body,
            answer_idx,
          });
        }
      }

      const finalLectureStructure = Object.values(groupedLectures);

      return reply.send({
        lectureItem: lectureItemRows[0],
        lectureDetails: finalLectureStructure,
      });
    } catch (err) {
      return reply.status(500).send({
        error:
          "コース情報を取得できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.delete("/api/lecture/course", async (request, reply) => {
    const { courseId } = request.body;

    try {
      await fastify.db.query("DELETE FROM courses WHERE id=?", [courseId]);
      return reply.send({
        msg: "コースを削除しました。",
      });
    } catch (err) {
      return reply.status(500).send({
        error:
          "コースの削除に失敗しました。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.put("/api/lecture/course", async (request, reply) => {
    const { lectureItem, lectureDetails, userId } = request.body;

    try {
      let thumbnailData = null;
      if (lectureItem.thumbnail) {
        if (typeof lectureItem.thumbnail === "string") {
          if (lectureItem.thumbnail.startsWith("data:")) {
            const base64Data = lectureItem.thumbnail.split(",")[1];
            thumbnailData = Buffer.from(base64Data, "base64");
          } else {
            thumbnailData = Buffer.from(lectureItem.thumbnail, "base64");
          }
        } else if (lectureItem.thumbnail.type === "Buffer") {
          thumbnailData = Buffer.from(lectureItem.thumbnail.data);
        } else {
          thumbnailData = lectureItem.thumbnail;
        }
      }

      if (!lectureItem.course_id) {
        const [courseResult] = await fastify.db.query(
          "INSERT INTO courses (course_name, course_description, thumbnail, user_id, published) VALUES (?, ?, ?, ?, 0)",
          [
            lectureItem.course_name,
            lectureItem.course_description,
            thumbnailData,
            userId,
          ]
        );

        const courseId = courseResult.insertId;

        for (let i = 0; i < lectureDetails.length; i++) {
          const section = lectureDetails[i];

          const [sectionResult] = await fastify.db.query(
            "INSERT INTO sections (section_name, section_number, course_id) VALUES (?, ?, ?)",
            [section.section_name, i + 1, courseId]
          );

          const sectionId = sectionResult.insertId;

          for (let j = 0; j < section.contents.length; j++) {
            const content = section.contents[j];

            if (content.content_type === "quiz") {
              const [contentResult] = await fastify.db.query(
                "INSERT INTO contents (content_name, content_number, content_type, section_id) VALUES (?, ?, 'quiz', ?)",
                [content.content_name || "確認テスト", j + 1, sectionId]
              );
              const contentId = contentResult.insertId;

              const [quizResult] = await fastify.db.query(
                "INSERT INTO questions (content_id, quiz_number, body) VALUES (?, ?, ?)",
                [contentId, 1, content.body]
              );
              const questionId = quizResult.insertId;

              const choices = content.choice_body || ["", "", "", ""];
              for (let k = 0; k < choices.length; k++) {
                await fastify.db.query(
                  "INSERT INTO choices (question_id, body_choice, choice_number, is_answer) VALUES (?,?,?,?)",
                  [questionId, choices[k], k + 1, content.answer_idx === k ? 1 : 0]
                );
              }
            } else {
              const [contentResult] = await fastify.db.query(
                "INSERT INTO contents (content_name, content_number, content_type, section_id) VALUES (?, ?, 'text', ?)",
                [content.content_name, j + 1, sectionId]
              );

              const contentId = contentResult.insertId;

              await fastify.db.query(
                "INSERT INTO content_texts (content_id, body) VALUES (?, ?)",
                [contentId, content.body]
              );
            }
          }
        }

        return reply.send({
          msg: "コースが正常に作成されました。",
          courseId: courseId,
        });
      } else {
        const courseId = lectureItem.course_id;

        await fastify.db.query(
          "UPDATE courses SET course_name = ?, course_description = ?, thumbnail = ? WHERE id = ?",
          [
            lectureItem.course_name,
            lectureItem.course_description,
            thumbnailData,
            courseId,
          ]
        );

        await fastify.db.query(
          "DELETE FROM content_texts WHERE content_id IN (SELECT id FROM contents WHERE section_id IN (SELECT id FROM sections WHERE course_id = ?))",
          [courseId]
        );
        await fastify.db.query(
          "DELETE FROM contents WHERE section_id IN (SELECT id FROM sections WHERE course_id = ?)",
          [courseId]
        );
        await fastify.db.query("DELETE FROM sections WHERE course_id = ?", [
          courseId,
        ]);

        for (let i = 0; i < lectureDetails.length; i++) {
          const section = lectureDetails[i];

          const [sectionResult] = await fastify.db.query(
            "INSERT INTO sections (section_name, section_number, course_id) VALUES (?, ?, ?)",
            [section.section_name, i + 1, courseId]
          );

          const sectionId = sectionResult.insertId;

          for (let j = 0; j < section.contents.length; j++) {
            const content = section.contents[j];

            if (content.content_type === "quiz") {
              const [contentResult] = await fastify.db.query(
                "INSERT INTO contents (content_name, content_number, content_type, section_id) VALUES (?, ?, 'quiz', ?)",
                [content.content_name || "確認テスト", j + 1, sectionId]
              );
              const contentId = contentResult.insertId;

              const [quizResult] = await fastify.db.query(
                "INSERT INTO questions (content_id, quiz_number, body) VALUES (?, ?, ?)",
                [contentId, 1, content.body]
              );
              const questionId = quizResult.insertId;

              const choices = content.choice_body || ["", "", "", ""];
              for (let k = 0; k < choices.length; k++) {
                await fastify.db.query(
                  "INSERT INTO choices (question_id, body_choice, choice_number, is_answer) VALUES (?,?,?,?)",
                  [questionId, choices[k], k + 1, content.answer_idx === k ? 1 : 0]
                );
              }
            } else {
              const [contentResult] = await fastify.db.query(
                "INSERT INTO contents (content_name, content_number, content_type, section_id) VALUES (?, ?, 'text', ?)",
                [content.content_name, j + 1, sectionId]
              );
              const contentId = contentResult.insertId;

              await fastify.db.query(
                "INSERT INTO content_texts (content_id, body) VALUES (?, ?)",
                [contentId, content.body]
              );
            }
          }
        }

        return reply.send({
          msg: "コースが正常に更新されました。",
          courseId: courseId,
        });
      }
    } catch (err) {
      console.error("コース操作エラー:", err);
      return reply.status(500).send({
        error:
          "コースの保存に失敗しました。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.post("/api/lecture/course/publish", async (request, reply) => {
    const { published, courseId } = request.body;

    try {
      await fastify.db.query("UPDATE courses SET published=? WHERE id=?", [
        published,
        courseId,
      ]);
      return reply.send({ msg: "公開設定の更新に成功しました。" });
    } catch (err) {
      console.log(err);
      return reply.status(500).send({
        error:
          "コースの公開設定でエラーが発生しました。システム担当者に問い合わせてください。",
      });
    }
  });

  fastify.put("/api/course/star", async (request, reply) => {
    const { courseId, pressed, userId } = request.body;

    try {
      if (pressed === true) {
        await fastify.db.query(
          "INSERT INTO stars (user_id,course_id) VALUES (?,?)",
          [userId, courseId]
        );
        return reply.send({ msg: "お気に入り登録成功" });
      }
      await fastify.db.query(
        "DELETE FROM stars where user_id=? AND course_id=?",
        [userId, courseId]
      );
      return reply.send({ msg: "お気に入り解除成功" });
    } catch (err) {
      console.log("お気に入り登録処理でエラーが発生。");
    }
  });
}

export default courseRoutes;
