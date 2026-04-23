import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { postScanTraffics } from "../../controllers/scan/postScanTraffics.js";
import { coordinateSchema } from "../../Interface/schema.js";

export const protectedScanRoutes = async (app: FastifyInstance) => {
  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.status(401).send({ message: "認証に失敗しました" });
    }
  };
  app.post(
    "/scanResult",
    { schema: coordinateSchema, preHandler: authenticate },
    postScanTraffics,
  );
};
