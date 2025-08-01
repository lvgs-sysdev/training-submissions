import pool from '../config/db';
import xss from 'xss';

export async function createPost(userId: string, content: string, imagePath: string | null) {
    const connection = await pool.getConnection();
    try {
        const sanitizedContent = xss(content);

        await connection.execute(
            `INSERT INTO posts (content, posts_image, id, created_at) VALUES (?, ?, ?, NOW())`,
            [sanitizedContent, imagePath, userId]
        );
    } finally {
        connection.release();
    }
}
