import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const pages__dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(pages__dirname);

export default async function (fastify, opts) {
  fastify.get("/login", async (request, reply) => {
    const pages_filePath = path.join(pages__dirname, "../pages/login.html");

    const login_html = await fs.readFile(pages_filePath, "utf-8");

    return reply.type("text/html").send(login_html);
  });

  fastify.post("/login", async (request, reply) => {
    const { user_ID, password } = request.body;

    if (!user_ID || !password) {
      return reply.status(401).send("ユーザIDまたはパスワードが不正です。");
      console.log(request.body);
    }

    try {
      const [rows] = await fastify.loginPool.execute(
        "SELECT COUNT(*) AS count FROM users WHERE user_ID = ? AND password = ?",
        [user_ID, password],
      );
      const usercount = rows[0].count;

      if (usercount === 1) {
        const [rows2] = await fastify.loginPool.execute(
          "SELECT user_name FROM users WHERE user_ID = ? AND password = ?",
          [user_ID, password],
        );

        const user_name = rows2[0].user_name;

        request.session.user = { name: user_name };
        console.log(request.session.user.name, "をセッション情報として渡す");

        return reply.send({ message: "ログイン成功" });
      } else {
        return reply
          .status(401)
          .send("ユーザIDもしくはパスワードが間違っています");
      }
    } catch (error) {
      console.error(error);
      reply.status(500).send("データベースエラーです");
    }
  });
}
