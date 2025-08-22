import express from 'express';
import multer from 'multer';
import path from 'path';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/postImage');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

router.post('/', isAuthenticated, upload.single('upload'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'ファイルがアップロードされていません。' });
        return;
    }
    const imageUrl = `/postImage/${req.file.filename}`;
    res.status(201).json({ url: imageUrl });
});


export default router;
