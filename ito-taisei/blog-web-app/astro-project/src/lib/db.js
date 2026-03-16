import mysql from 'mysql2/promise';

export const dbConfig = {
  host: import.meta.env.DB_HOST,
  port: import.meta.env.DB_PORT,
  user: import.meta.env.DB_USER,
  password: import.meta.env.DB_PASS,
  database: import.meta.env.DB_NAME,
};

export async function connectDb() {
  return await mysql.createConnection(dbConfig);
}
