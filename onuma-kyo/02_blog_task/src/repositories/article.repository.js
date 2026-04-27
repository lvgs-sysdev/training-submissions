import { createConnection } from '../database.js';

export const findAll = async (limit) => {
  const connection = await createConnection();
  let sql = `
            SELECT
                articles.id,
                articles.article_title AS articleTitle,
                articles.content,
                users.user_id	AS userId,
                articles.updated_at AS updateAt,
                tags.name AS tag
            FROM articles 
            INNER JOIN article_tags ON articles.id = article_tags.article_id
            INNER JOIN tags ON article_tags.tag_id = tags.id
            INNER JOIN users ON articles.user_id = users.id
            ORDER BY articles.updated_at DESC
  `;
  let rows;
  if (limit) {
    sql += `LIMIT :limit`;
    [rows] = await connection.query(sql, { limit });
  } else {
    [rows] = await connection.query(sql);
  }
  await connection.end();
  return rows;
};

export const findByID = async (id) => {
  const connection = await createConnection();
  const [row] = await connection.query(
    `
            SELECT
                articles.id,
                articles.article_title AS articleTitle,
                articles.content,
                users.user_id	AS userId,
                articles.updated_at AS updateAt,
                tags.name AS tag
            FROM articles 
            INNER JOIN article_tags ON articles.id = article_tags.article_id
            INNER JOIN tags ON article_tags.tag_id = tags.id
            INNER JOIN users ON articles.user_id = users.id
            WHERE articles.id = :id;`,
    { id: id },
  );
  await connection.end();
  return row;
};

export const create = async (articleTitle, content, userId) => {
  const sql = `
      INSERT INTO articles
      SET :datum
    `;
  const datum = {
    article_title: articleTitle,
    content: content,
    user_id: userId,
    updated_at: new Date(),
  };
  const connection = await createConnection();
  await connection.query(sql, { datum });
  connection.end();
};

export const update = async (id, articleTitle, content, tagId) => {
  const connection = await createConnection();
  const sql = `
      UPDATE articles 
      LEFT JOIN article_tags
      ON articles.id = article_tags.article_id
      SET :datum
      WHERE articles.id = :id
    `;
  const datum = {
    article_title: articleTitle,
    content: content,
    updated_at: new Date(),
    'article_tags.tag_id': tagId,
  };
  await connection.query(sql, { datum, id });
  connection.end();
};
