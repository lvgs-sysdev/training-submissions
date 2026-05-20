import { createConnection } from '../database.js';

export const findAll = async () => {
  const connection = await createConnection();
  const [rows] = await connection.query(`
            SELECT
              id AS tagId,
              name
            FROM tags;
        `);
  await connection.end();
  return rows;
};
