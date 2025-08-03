import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// TypeScriptでreqオブジェクトにuserプロパティを追加するための型拡張
declare global {
  namespace Express {
    interface Request {
      user?: any; // jwt.verifyの結果を格納する
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // リクエストのクッキーからトークンを取得

  const token = req.cookies.token;

  if (!token) {
    // トークンが存在しない場合は認証エラー
    return res.status(401).json({ message: "認証トークンがありません" });
  }

  try {
    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    // 検証成功後、デコードされたペイロードをリクエストオブジェクトに添付
    req.user = decoded;
    next(); // 次のミドルウェアまたはルートハンドラへ
  } catch (error) {
    console.error("JWT Verify Error:", error);
    // トークンが無効または期限切れの場合
    return res.status(403).json({ message: "無効なトークンです" });
  }
};
