import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  // 現在の日時、HTTPメソッド、URLをコンソールに出力
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

  // 次のミドルウェアまたはルートハンドラへ処理を渡す
  next();
};
