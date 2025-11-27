'use strict';

const db = require("../db/db");

const getUserFromSession = async (sessionId) => {
  const [rows] = await db.query(`
    SELECT
    users.id,
    users.user_id
    FROM
    sessions
    JOIN
    users
    ON
    sessions.user_id = users.user_id
    WHERE
    sessions.session_id = :sessionId
    `,
    { sessionId: sessionId }
  );
  
  if (rows.length === 0) return null;
  
  return rows[0];
}

const getArticleAuthorId = async (articleId) => {
  const [rows] = await db.query(`
    SELECT
    user_id
    FROM
    articles
    WHERE
    id = :articleId
    `,
    { articleId: articleId }
  );
  
  if (rows.length === 0) return null;
  
  return rows[0].user_id;
}

module.exports = { getUserFromSession, getArticleAuthorId };