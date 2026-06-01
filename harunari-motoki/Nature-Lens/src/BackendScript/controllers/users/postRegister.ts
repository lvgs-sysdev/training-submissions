import { userInfo } from "../../../library/users/typeDefinition.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { registerDBAccess } from "../../service/users/registerDBAccess.js";

export const postRegister = async function (
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const rawdata = request.body as userInfo;
  try {
  await registerDBAccess(rawdata);  
  const message = "success";
    return message;
  } catch (error) {
    throw error;
  }
};
