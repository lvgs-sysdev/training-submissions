import fp from "fastify-plugin";
import mysql from "mysql2/promise";

//新規登録機能
export const registerPool = await mysql.createPool({
  host: process.env.DB_register_host,
  user: process.env.DB_register_user,
  password: process.env.DB_register_pass,
  database: process.env.DB_register_db,

  connectionLimit: 10,
});
//ログイン機能
export const loginPool = await mysql.createPool({
  host: process.env.DB_login_host,
  user: process.env.DB_login_user,
  password: process.env.DB_login_pass,
  database: process.env.DB_login_db,

  connectionLimit: 10,
});
//トップページ記事表示機能
export const toppagePool = await mysql.createPool({
  host: process.env.DB_toppage_host,
  user: process.env.DB_toppage_user,
  password: process.env.DB_toppage_pass,
  database: process.env.DB_toppage_db,

  connectionLimit: 10,
});
//詳細記事表示機能
export const detailpagePool = await mysql.createPool({
  host: process.env.DB_detailpage_host,
  user: process.env.DB_detailpage_user,
  password: process.env.DB_detailpage_pass,
  database: process.env.DB_detailpage_db,

  connectionLimit: 10,
});

//詳細記事表示機能
export const edituserPool = await mysql.createPool({
  host: process.env.DB_edituser_host,
  user: process.env.DB_edituser_user,
  password: process.env.DB_edituser_pass,
  database: process.env.DB_edituser_db,

  connectionLimit: 10,
});

//articlesとusersの読み取り機能
export const SelectArticlePool = await mysql.createPool({
  host: process.env.DB_selectarticlesuser_host,
  user: process.env.DB_selectarticlesuser_user,
  password: process.env.DB_selectarticlesuser_pass,
  database: process.env.DB_selectarticlesuser_db,

  connectionLimit: 10,
});

//articlesの更新機能
export const UpdateArticlePool = await mysql.createPool({
  host: process.env.DB_updatearticlesuser_host,
  user: process.env.DB_updatearticlesuser_user,
  password: process.env.DB_updatearticlesuser_pass,
  database: process.env.DB_updatearticlesuser_db,

  connectionLimit: 10,
});

async function dbPlugin(fastify, opts) {
  fastify.decorate("registerPool", registerPool);
  fastify.decorate("loginPool", loginPool);
  fastify.decorate("toppagePool", toppagePool);
  fastify.decorate("detailpagePool", detailpagePool);
  fastify.decorate("edituserPool", edituserPool);
  fastify.decorate("SelectArticlePool", SelectArticlePool);
  fastify.decorate("UpdateArticlePool", UpdateArticlePool);
}

export default fp(dbPlugin);
