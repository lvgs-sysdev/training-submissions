import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createPost } from '../controllers/createPost';
import { getAllPosts, getPostsByUser } from '../controllers/postController';

const router = express.Router();
const uploadDir = path.join(__dirname, '../../public/postImage');

// アップロード先ディレクトリを確認・作成
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// multer 設定
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

/**
 * 画像単体アップロード用（CKEditor用など）
 */
router.post('/upload', upload.single('upload'), (req, res) => {
    const fileName = req.file?.filename;
    if (!fileName) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    res.status(200).json({ imageUrl: `/postImage/${fileName}` });
});

/**
 * 投稿作成用API：本文＋画像パスをDBに保存
 */
router.post('/', async (req, res) => {
    const { content, imagePath } = req.body;
    const userId = req.session.userId; // ここでUUIDv7を取得

    if (!userId || !content) {
        res.status(400).json({ error: 'userId and content are required' });
        return;
    }

    try {
        await createPost(userId, content, imagePath || null);
        res.status(201).json({ message: 'Post created successfully' });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 全投稿取得
 */
router.get('/', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json({ posts });
    } catch (error) {
        console.error('投稿取得エラー:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * 特定ユーザーの投稿取得
 */
router.get('/by-user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await getPostsByUser(userId);
        res.json({ posts });
    } catch (error) {
        console.error('ユーザー投稿取得エラー:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
