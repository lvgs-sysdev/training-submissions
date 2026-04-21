import * as dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

console.log("DB.ts内");
console.log("ホスト名", process.env.USERS_READWRITE_HOST);
console.log("user名", process.env.USERS_READWRITE_USER);
console.log("db名", process.env.USERS_READWRITE_DB);
console.log("pass名", process.env.USERS_READWRITE_PASS);
console.log("DB.ts内");

export const usersPool = new Pool({
  host: process.env.USERS_READWRITE_HOST,
  user: process.env.USERS_READWRITE_USER,
  password: process.env.USERS_READWRITE_PASS,
  database: process.env.USERS_READWRITE_DB,
  port: 5432,
  max: 20,
  idleTimeoutMillis: 3000,
});

usersPool.on("error", (err) => {
  console.error("unexpected DB Error:", err);
  process.exit(-1);
});
