import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const pages__dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(pages__dirname);

export default async function (fastify, opts) {
  fastify.get("/register", async (request, reply) => {
    const pages_filePath = path.join(pages__dirname, "../pages/register.html");

    const register_html = await fs.readFile(pages_filePath, "utf-8");

    return reply.type("text/html").send(register_html);
  });

  fastify.post("/register", async (request, reply) => {
    const { user_ID, user_name, password } = request.body;

    try {
      await fastify.registerPool.execute(
        "INSERT INTO users (user_ID, user_name, password) VALUES (?, ?, ?)",
        [user_ID, user_name, password],
      );
      console.log("登録データ:", request.body);

      return "登録完了しました。";
    } catch (error) {
      console.error(error);
      reply.status(500).send("データベースエラーです");
    }
  });
}
