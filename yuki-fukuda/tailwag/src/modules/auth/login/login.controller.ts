import type { FastifyRequest, FastifyReply } from "fastify";
import * as loginService from "./login.service.js";
import type { LoginBody } from "./login.schema.js";

export const login = async (
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = request.body;
    const user = await loginService.loginUser(email, password);

    const token = await reply.jwtSign({
      id: user.id,
      account_name: user.account_name,
      email: user.email,
    });

    return reply.code(200).send({
      message: "ログインが完了しました!",
      token: token,
      user: {
        id: user.id,
        account_name: user.account_name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    request.log.error(error);
    return reply
      .code(401)
      .send({ message: "メールアドレスまたはパスワードが正しくありません" });
  }
};
