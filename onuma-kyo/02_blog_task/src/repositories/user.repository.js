import { createConnection } from '../database.js';

export const findAll = async () => {
  const connection = await createConnection();
  const [rows] = await connection.query(`
            SELECT
                user_id AS userId, 
                user_name AS userName,
                email,
                sns_link AS snsLink
            FROM users;
        `);
  await connection.end();
  return rows;
};

export const findByID = async (userId) => {
  const connection = await createConnection();
  const [row] = await connection.query(
    `
            SELECT
                id,
                user_id AS userId, 
                password,
                user_name AS userName,
                email,
                sns_link AS snsLink
            FROM users
            WHERE user_id = :userId;`,
    { userId: userId },
  );
  await connection.end();
  return row;
};

export const findBySurrogateKey = async (id) => {
  const connection = await createConnection();
  const [row] = await connection.query(
    `
            SELECT
                id,
                user_id AS userId, 
                password,
                user_name AS userName,
                email,
                sns_link AS snsLink
            FROM users
            WHERE id = :id;`,
    { id: id },
  );
  await connection.end();
  return row;
};

export const create = async (userId, password, userName, email, snsLink) => {
  const sql = `
      INSERT INTO users
      SET :datum
    `;
  const datum = {
    user_id: userId,
    password: password,
    user_name: userName,
    email: email,
    sns_link: snsLink,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const connection = await createConnection();
  await connection.query(sql, { datum });
  connection.end();
};

export const update = async (id, userId, userName, email, snsLink) => {
  const connection = await createConnection();
  const sql = `
      UPDATE users
      SET :datum
      WHERE id = :id
    `;
  const datum = {
    user_id: userId,
    user_name: userName,
    email: email,
    sns_link: snsLink,
    updated_at: new Date(),
  };
  await connection.query(sql, { datum, id });
  connection.end();
};
