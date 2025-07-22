// src/middlewares/errorHandler.ts の修正
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/customError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("### グローバルエラーハンドラーでエラーを捕捉しました ###");
  console.error("捕捉されたエラーオブジェクト:", err);

  if (err instanceof CustomError) {
    console.log(`--- CustomError 詳細 ---`);
    console.log(`Message: ${err.message}`);
    console.log(`StatusCode: ${err.statusCode}`);
    console.log(`Details: ${err.details}`);
    console.log(`--- CustomError 詳細ここまで ---`);

    const statusCode = err.statusCode || 500;

    const responseBody: { message: string; code?: string; field?: string } = {
      message: err.message,
    };

    if (err.details) {
      responseBody.field = err.details;
    }

    console.log(`Sending response: Status ${statusCode}, Body:`, responseBody);
    return res.status(statusCode).json(responseBody);
  }

  console.error("### 予期せぬサーバーエラーが発生しました ###");
  console.error("エラー詳細:", err);
  res.status(500).json({
    message: "サーバーで予期せぬエラーが発生しました。",
    code: "INTERNAL_SERVER_ERROR",
  });
};
