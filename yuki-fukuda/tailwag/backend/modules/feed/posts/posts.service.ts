import pool from "../../../shared/database/db.js";
import type { ResultSetHeader } from "mysql2";

export const createPostWithImages = async (
  userId: number,
  content: string,
  breedIds: number[],
  imageUrls: string[],
) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [postResult] = await connection.query<ResultSetHeader>(
      "INSERT INTO posts (user_id, content, created_at) VALUES (?,?,NOW())",
      [userId, content],
    );

    const postId = postResult.insertId;

    for (const breedId of breedIds) {
      await connection.query<ResultSetHeader>(
        "INSERT INTO post_breeds (post_id, breed_id) VALUES (?, ?)",
        [postId, breedId],
      );
    }

    const values = imageUrls.map((url, i) => [postId, url, i + 1]);

    await connection.query(
      "INSERT INTO post_images (post_id, image_url, display_order) VALUES ?",
      [values],
    );

    await connection.commit();
    return postId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
