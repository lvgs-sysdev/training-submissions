import pool from '../config/db';

export async function getAllPosts() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`
            SELECT 
                p.post_id, 
                p.content, 
                p.posts_image AS imagePath, 
                u.user_name, 
                u.account_id AS userId, 
                u.user_image AS avatarImageUrl
            FROM posts p
            JOIN users u ON p.id = u.id
            ORDER BY p.created_at DESC;
        `);
        return rows;
    } finally {
        connection.release();
    }
}

export async function getPostsByUser(userId: string) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query(`
            SELECT 
                p.post_id, 
                p.content, 
                p.posts_image AS imagePath, 
                u.user_name, 
                u.account_id AS userId, 
                u.user_image AS avatarImageUrl
            FROM posts p
            JOIN users u ON p.id = u.id
            WHERE u.account_id = ?
            ORDER BY p.created_at DESC;
        `, [userId]);
        return rows;
    } finally {
        connection.release();
    }
}
