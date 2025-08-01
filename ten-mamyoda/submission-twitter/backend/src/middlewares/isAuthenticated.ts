import { Request, Response, NextFunction } from 'express';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.isLoggedIn) {
        // ログイン済みユーザーなら次へ
        next();
    } else {
        // 未ログインなら401 Unauthorizedを返す
        res.status(401).json({ message: '認証が必要です。' });
    }
}
