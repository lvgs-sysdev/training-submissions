import { userGET } from "../../js/User.js";
import { editUserGET } from "../../js/editUser.js";
import { editUserPOST } from "../../js/editUser.js";
import { editBlogGET } from "../../js/editBlog.js";
import { editBlogPOST } from "../../js/editBlog.js";

export default function (fastify, opts) {
  fastify.get("/User", userGET);
  fastify.get("/editUser", editUserGET);
  fastify.post("/editUser", editUserPOST);
  fastify.get("/editBlog", editBlogGET);
  fastify.post("/editBlog", editBlogPOST);
}
