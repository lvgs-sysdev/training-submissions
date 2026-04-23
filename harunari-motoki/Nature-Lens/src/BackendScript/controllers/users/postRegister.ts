import { userInfo } from "../../../library/users/typeDefinition.js";
import { usersPool } from "../../models/users/DB.js";
import { registerSQL } from "../../models/users/userSQL.js";
import { DBAccess } from "../../models/users/DBAccess.js";
import { modifyUserInfo } from "../../service/users/modifyUseInfo.js";
import { transformData } from "../../service/users/transformData.js";
import { FastifyReply, FastifyRequest } from "fastify";

export const postRegister = async function (
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const rawdata = request.body as userInfo;
  console.log("クライアントから受け取ったデータの中身", rawdata);

  try {
    const objectData = await modifyUserInfo(rawdata);
    const arrayData = await transformData(objectData);
    await DBAccess(usersPool, registerSQL, arrayData);
    const message = "success";
    return message;
  } catch (error) {
    throw error;
  }
};
