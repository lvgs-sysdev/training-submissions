import mysql from "mysql2/promise";
import { dbConfig } from "./config.js";

export const applyArticle = async (userId, title, context) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const currentDate = new Date();
    await connection.query(
      "INSERT INTO articles (user_id,article_title,content,updated_at) VALUES (?, ?, ?, ?)",
      [userId, title, context, currentDate],
      (error) => {
        if (error) throw error;
      }
    );
    (await connection).end();
  } catch (e) {
    console.log(e);
  }
};

export const getNewArticle = async (numArticle) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [raws, fields] = await connection.query(
      "SELECT * FROM articles ORDER BY updated_at DESC LIMIT ?",
      [numArticle],
      (error) => {
        if (error) throw error;
      }
    );
    (await connection).end();
    return [raws, fields];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getArticleInfo = async (articleId) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [raws, fields] = await connection.query(
      "SELECT * FROM articles WHERE article_id = ?",
      [articleId]
    );
    (await connection).end();
    return raws;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const editArticle = async (
  articleId,
  newArticleTitle,
  newArticleContext
) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const currentDate = new Date();
    await connection.query(
      "UPDATE articles SET article_title=?,content=?,updated_at=? WHERE article_id=?",
      [newArticleTitle, newArticleContext, currentDate, articleId],
      (error) => {
        if (error) throw error;
      }
    );
    await connection.end;
  } catch (e) {
    console.log(e);
  }
};
