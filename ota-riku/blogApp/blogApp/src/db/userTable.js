import mysql from "mysql2/promise";
import { dbConfig } from "./config.js";

export const registUser = async (user_id, password) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(
      "INSERT INTO users (user_id,password) VALUES (?, ?)",
      [user_id, password],
      (error) => {
        if (error) throw error;
      }
    );
    await connection.end();
  } catch (e) {
    console.log(e);
  }
};

export const confirmUser = async (user_id) => {
  try {
    console.log(user_id);
    const connection = await mysql.createConnection(dbConfig);
    const [raws, fields] = await connection.query(
      "SELECT * FROM users WHERE user_id=?",
      [user_id]
    );
    await connection.end;
    return [raws, fields];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getUserInfo = async (user_id) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [raws, fields] = await connection.query(
      "SELECT user_name FROM users WHERE user_id=?",
      [user_id]
    );
    await connection.end;

    return [raws, fields];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const editUser = async (newUserId, newUserName, currentUserId) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(
      "UPDATE users SET user_id=?,user_name=? WHERE user_id=?",
      [newUserId, newUserName, currentUserId],
      (error) => {
        if (error) throw error;
      }
    );
    await connection.end;
  } catch (e) {
    console.log(e);
  }
};
