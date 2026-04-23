import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { postLogout } from "../../controllers/users/postLogout.js";

export const protectedUserRoutes = async (app: FastifyInstance) => {
  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      console.error("認証処理実行");
      await request.jwtVerify();
    } catch (error: any) {
      console.error(error.message);
      reply.status(401).send({ message: error.message });
    }
  };
  try {
    app.post("/logout", { preHandler: authenticate }, postLogout);
  } catch (error: any) {
    console.error("ハンドラー内のエラー", error.message);
    throw new Error(error.message);
  }
};
