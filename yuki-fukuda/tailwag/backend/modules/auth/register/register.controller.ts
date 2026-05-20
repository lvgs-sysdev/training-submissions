import type { FastifyRequest, FastifyReply } from "fastify";
import * as registrationService from "./register.service.js";
import type { RegisterBody } from "./register.schema.js";

export const register = async (
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply,
) => {
  try {
    const { account_id, account_name, email, password } = request.body;

    const result = await registrationService.createUser(
      account_id,
      account_name,
      email,
      password,
    );

    return reply.code(201).send({
      message: "ユーザー登録が完了しました!",
      accountId: result.insertId,
    });
  } catch (error: unknown) {
    request.log.error(error);
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "ER_DUP_ENTRY") {
        return reply
          .code(409)
          .send({ message: "そのメールアドレスは既に登録されています。" });
      }
    }
    return reply
      .code(500)
      .send({ message: "サーバー内部エラーが発生しました" });
  }
};
