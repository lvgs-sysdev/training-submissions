// Require the framework and instantiate it

// ESM
import Fastify from "fastify";
import mysql from "mysql2/promise";
import path from "node:path";
import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import fastifyFormbody from "@fastify/formbody";
import fastifySession from "@fastify/session";
import bcrypt from "bcryptjs";
import { userInfo } from "node:os";

import {
  registUser,
  confirmUser,
  editUser,
  getUserInfo,
} from "./public/js/db/userTable.js";

import { transformTimestamp } from "./public/js/util/TranformTimestamp.js";

import { editArticle, getArticleInfo } from "./public/js/db/articleTable.js";
import { loadNewArticle } from "./public/js/util/LoadArticle.js";

const fastify = Fastify({ logger: true });
const __dirname = import.meta.dirname;

fastify.register(fastifyCookie, {
  secret: "secret-cookie",
});

fastify.register(fastifySession, {
  secret: "a secret key with hyper long path key.",
  cookie: {
    maxAge: 300000,
    secure: false,
  },
  saveUninitialized: false,
});

// POST対応
fastify.register(fastifyFormbody);

// メモ: fastify.decorateで自作関数みたいに定義可能
fastify.decorate("authenticate", async (req, reply) => {
  if (!req.session.get("loggedIn")) {
    reply.redirect("/login");
    return false;
  }
  return true;
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

// fetch api用
fastify.get("/api/login-status", (req, reply) => {
  if (req.session.user) {
    return reply.send({ loggedIn: true });
  }
  return reply.send({ loggedIn: false });
});

fastify.get("/api/user-info", async (req, res) => {
  const userId = req.session.user;
  try {
    const [raws, fields] = await getUserInfo(userId);

    console.log(raws[0].user_name);
    if (raws.length <= 0) {
      console.log("username is not found.");
    } else {
      const username = raws[0].user_name;
      return res.send({ userId: `${userId}`, userName: `${username}` });
    }
  } catch (e) {
    console.log(e);
  }
});

fastify.post("/api/user-info", async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  try {
    const [raws, fields] = await getUserInfo(userId);

    if (raws.length <= 0) {
      console.log("username is not found.");
      return res.send({ userId: ``, userName: `` });
    } else {
      const username = raws[0].user_name;
      return res.send({ userId: `${userId}`, userName: `${username}` });
    }
  } catch (e) {
    console.log(e);
  }
});

fastify.post("/api/load-new-article", async (req, res) => {
  console.log(req.body);
  const { articleNum } = req.body;
  console.log(articleNum);
  const newArticles = await loadNewArticle(articleNum);

  // 記事HTMLの生成
  let articleHtml = ``;
  articleHtml += `<ul class="maincontents-card-ul">`;
  for (let i = 0; i < newArticles.length; i++) {
    articleHtml += `
      <li class="maincontents-card-elem">
         <article>
              <a href="/detail/${newArticles[i].article_id}">
                <img src="Image/card/card1.png" alt="card1" class="maincontents-card-img"/>
              </a>
              <div class="maincontents-card-categorydate-ul">
                <h2 class="maincontents-card-catogorydate-categorytext">Travel</h2>
                <p class="util-margin-0">|</p>
                <h2 class="maincontents-card-catogorydate-datetext">${transformTimestamp(
                  newArticles[i].updated_at
                )}</h2>
              </div>
              <dl>
                <dt>
                  <h2><a href="/detail" class="maincontents-card-title-text util-margin-0">${
                    newArticles[i].article_title
                  }</a></h2>
                </dt>
                <dd class="maincontents-card-context-dd">
                  <a href="/detail" class="maincontents-card-context util-margin-0">${newArticles[
                    i
                  ].content.slice(0, 20)}</a>
                </dd>
              </dl>
              </article>
            </li>
    `;
  }
  articleHtml += `</ul>`;
  return res.type("text/html").send(articleHtml);
});

fastify.post("/api/article-info", async (req, res) => {
  const { articleId } = req.body;
  const articleInfo = await getArticleInfo(articleId);
  return res.send(articleInfo[0]);
});
////////

fastify.get("/home", (req, reply) => {
  return reply.sendFile("Design.html");
});

fastify.get("/detail/:articleId", (req, reply) => {
  return reply.sendFile("ArticleDetail.html");
});

fastify.get("/register", (req, reply) => {
  return reply.sendFile("RegistAccount.html");
});

fastify.post("/register", async (req, reply) => {
  const { user_id, password } = req.body;

  try {
    const password_hashed = await bcrypt.hash(password, 10);
    console.log(req.body);
    console.log(password_hashed);

    await registUser(user_id, password_hashed);
    return reply.status(201).json({ message: "request is completed." });
  } catch (e) {
    console.log(e);
  }
});

fastify.get("/login", (req, reply) => {
  return reply.sendFile("Login.html");
});

fastify.post("/login", async (req, reply) => {
  const { user_id, password } = req.body;
  try {
    const [raws, fields] = await confirmUser(user_id);
    if (await bcrypt.compareSync(password, raws[0].password)) {
      console.log("Login successed");
      req.session.user = user_id;
      return reply.code(200).send({ message: "Login success." });
    } else {
      console.log("Login failed.");
      return reply.code(401).send({ message: "Login failed." });
    }
  } catch (e) {
    console.log(e);
    return reply
      .code(500)
      .send({ message: "Login failed due to a server error." });
  }
});

fastify.get("/user", (req, reply) => {
  if (req.session.user) {
    return reply.sendFile("UserInfo.html");
  }
  return reply.redirect("/login");
});

fastify.get("/editUser", (req, reply) => {
  if (req.session.user) {
    return reply.sendFile("EditUser.html");
  }
  return reply.redirect("/login");
});

fastify.post("/editUser", async (req, res) => {
  console.log(req.body);
  if (req.session.user) {
    try {
      const { user_id, user_name } = req.body;
      await editUser(user_id, user_name, req.session.user);
      req.session.user = user_id;
    } catch (e) {
      console.log(e);
      return res.redirect("/editUser");
    }
    return res.redirect("/home");
  }
  return res.redirect("/login");
});

fastify.get("/editBlog/:articleId", async (req, res) => {
  if (req.session.user) {
    return res.sendFile("EditArticle.html");
  }
  return res.redirect("/login");
});

fastify.post("/editBlog", async (req, res) => {
  const { articleId, title, context } = req.body;
  console.log(`${articleId},${title},${context}`);
  if (req.session.user) {
    try {
      await editArticle(articleId, title, context);
      return res.redirect("/home");
    } catch (e) {
      console.log(e);
      return res.redirect("/home");
    }
  }
  return res.redirect("/login");
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
