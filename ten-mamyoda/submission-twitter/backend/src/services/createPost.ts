import pool from '../config/db';
import { FilterXSS, getDefaultWhiteList } from 'xss';

const myXSS = new FilterXSS({
    whiteList: {
        ...getDefaultWhiteList(),
        img: ['src', 'alt'],  // src と alt を許可
    },
    onTagAttr(tag, name, value) {
        // __POST_IMAGE__ はそのまま通す
        if (tag === 'img' && name === 'src' && value === '__POST_IMAGE__') {
            return `${name}="${value}"`;
        }
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
});

export async function createPost(
    userId: string,
    content: string,
    imagePath: string | null
) {
    const connection = await pool.getConnection();
    try {
        const sanitizedContent = myXSS.process(content);

        await connection.execute(
            `INSERT INTO posts (content, posts_image, id, created_at) VALUES (?, ?, ?, NOW())`,
            [sanitizedContent, imagePath, userId]
        );
    } finally {
        connection.release();
    }
}
