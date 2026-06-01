import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import authNFunction from "../model/loginModel.js";

const pages__dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(pages__dirname);

export const loginGET = async function (request, reply) {
  const pages_filePath = path.join(pages__dirname, "../pages/login.html");

  const login_html = await fs.readFile(pages_filePath, "utf-8");

  return reply.type("text/html").send(login_html);
};

export const loginPOST = async function (request, reply) {
  const { user_ID } = request.body;
  const plainPassword = request.body.password;

  const answer = await authNFunction(
    user_ID,
    plainPassword,
    request.server.loginPool,
  );

  if (answer.type === 200) {
    request.session.user = answer.info;
    return reply.status(answer.type).send({ message: answer.message });
  } else {
    return reply.status(answer.type).send({ message: answer.message });
  }
};
