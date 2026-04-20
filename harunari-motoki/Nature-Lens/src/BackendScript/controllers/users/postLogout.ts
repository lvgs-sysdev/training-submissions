import { accessStatus } from "@/library/users/typeDefinition";
import { FastifyReply, FastifyRequest } from "fastify";

export const postLogout = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    reply.clearCookie("refreshToken", {
      path: "/",
      httpOnly: true,
      secure: false, //本番環境ではtrue
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60,
    });
    const result: accessStatus = {
      status: "success",
    };
    reply.status(200).send(result);
  } catch (error: any) {
    request.log.error(error);
    reply.status(500).send({ status: "error", message: "Logout failed" });
  }
};
