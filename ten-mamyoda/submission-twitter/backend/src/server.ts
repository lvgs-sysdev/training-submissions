import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import userRoutes from './routes/userRoutes';
import postsRoutes from './routes/posts'; // 画像アップロード含む投稿処理を統合済み

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// セッションの秘密鍵チェック
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error('SESSION_SECRET is not defined');
}

// CORS設定（Cookie付き通信を許可）
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// JSONとFormデータのパース
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// セッション設定
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1日
    },
}));

// publicフォルダを静的配信
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// APIルート
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);

// 簡単なルート応答
app.get('/', (req, res) => {
    res.send('API Server is running.');
});

// サーバー起動
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
