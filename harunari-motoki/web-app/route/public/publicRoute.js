import { indexGET } from "../../js/index.js";
import { detailGET } from "../../js/detail.js";
import { loginGET } from "../../js/login.js";
import { loginPOST } from "../../js/login.js";
import { registerGET } from "../../js/register.js";
import { registerPOST } from "../../js/register.js";

export default async function (fastify, opts) {
  fastify.get("/", indexGET);
  fastify.get("/detail", detailGET);
  fastify.get("/login", loginGET);
  fastify.post("/login", loginPOST);
  fastify.get("/register", registerGET);
  fastify.post("/register", registerPOST);
}
