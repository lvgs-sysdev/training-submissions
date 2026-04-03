import type { FastifyRequest, FastifyReply } from "fastify";

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  // サーバー側では特にDBを操作する必要はありません。
  // 「ログアウト処理を受け付けたよ」という合図を返します。
  return reply.code(200).send({
    message: "ログアウトしました。ブラウザ側のトークンを破棄してください。",
  });
};
