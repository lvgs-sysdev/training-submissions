import mysql from "mysql2/promise";
import "dotenv/config";

console.log("--- DB Connection Debug ---");
console.log("CWD (現在地):", process.cwd());
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("---------------------------");
const pool = mysql.createPool({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
