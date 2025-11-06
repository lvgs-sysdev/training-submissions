import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import sendVerificationMail from "../lib/verification.js";

async function authRoutes(fastify) {
  fastify.post("/api/auth/register", async (request, reply) => {
    const { email, userName, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(email)

    try {
      await fastify.db.query(
        "INSERT INTO users (email, password, user_name) VALUES (?, ?, ?)",
        [email, hashedPassword, userName]
      );

      // メール認証用トークン
      const verificationToken = uuidv4();

      const expiresDate = new Date();
      expiresDate.setDate(expiresDate.getDate() + 1);

      await fastify.db.query(
        "INSERT INTO verifications (email, verification_token, expires_at) VALUES (?, ?, ?)",
        [
          email,
          verificationToken,
          expiresDate.toISOString().slice(0, 19).replace("T", " "),
        ]
      );

      // メール送信は非致命扱い（失敗しても登録は成功させる）
      const mailResult = await sendVerificationMail(email, verificationToken);
      if (!mailResult?.ok) {
        fastify.log.warn({ mailResult }, "verification email not delivered");
      }

      return reply.send({ msg: "DBにユーザーが登録されました。" });
    } catch (err) {
      console.log(err)
      if (err.code === "ER_DUP_ENTRY") {
        if (err.sqlMessage.includes("email")) {
          return reply
            .code(409)
            .send({ error: "このメールアドレスは既に使われています。" });
        }
        return reply
          .code(409)
          .send({ error: "このユーザー名は既に使われています。" });
      }
      return reply.code(500).send({
        error: "登録できませんでした。システム担当者に問い合わせてください。",
      });
    }
  });

  // メールアドレス検証用トークン更新API
  fastify.post("/api/auth/refreshToken", async (request, reply) => {
    const { email } = request.body;

    const newVerificationToken = uuidv4();

    const newExpiresDate = new Date();
    newExpiresDate.setDate(newExpiresDate.getDate() + 1);

    try {
      await fastify.db.query(
        "UPDATE verifications SET verification_token=?, expires_at=? WHERE email=?",
        [
          newVerificationToken,
          newExpiresDate.toISOString().slice(0, 19).replace("T", " "),
          email,
        ]
      );

      const refreshMailResult = await sendVerificationMail(
        email,
        newVerificationToken
      );
      if (!refreshMailResult?.ok) {
        fastify.log.warn({ refreshMailResult }, "verification refresh email not delivered");
      }

      return reply.status(200).send({ msg: "認証用メールを再送信しました。" });
    } catch (err) {
      return reply.status(500).send({
        error:
          "メールアドレスを再送信できませんでした。再度ユーザー登録を行ってください。",
      });
    }
  });

  // メールアドレス検証用API
  fastify.post("/api/auth/verify", async (request, reply) => {
    const { verificationToken } = request.body;

    try {
      const [verifiedEmailRows] = await fastify.db.query(
        "SELECT email FROM verifications WHERE verification_token=? AND expires_at>now()",
        [verificationToken]
      );

      if (!verifiedEmailRows || verifiedEmailRows.length === 0) {
        return reply
          .status(401)
          .send({ error: "リンクが誤っています。再度認証を行ってください。" });
      }

      const verifiedEmail = verifiedEmailRows[0].email;

      await fastify.db.query("DELETE FROM verifications WHERE email=?", [
        verifiedEmail,
      ]);

      await fastify.db.query("UPDATE users SET verified=1 WHERE email=?", [
        verifiedEmail,
      ]);

      return reply.status(200).send({
        msg: "認証成功",
      });
    } catch (err) {
      return reply.status(500).send({
        error:
          "メールアドレスの検証に失敗しました。再度メールアドレスの認証を行ってください",
      });
    }
  });
}

export default authRoutes;
