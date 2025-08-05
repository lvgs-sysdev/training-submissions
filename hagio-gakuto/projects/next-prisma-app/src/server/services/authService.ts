import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma"; // PrismaClientのインスタンス

// JWTのペイロード（中身）の型を定義
interface UserPayload {
  userId: number;
  name: string;
  // 他にトークンに含めた情報があれば追加
}

/**
 * JWTを検証し、該当するユーザー情報を返す関数
 * @param token JWT文字列
 * @returns ユーザー情報（パスワードは除く）
 */
export async function getUserFromToken(token: string) {
  // 1. トークンを秘密鍵で検証・デコードする
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as UserPayload;

  // 2. デコードした情報からuserIdを取得
  const userId = decoded.userId;
  if (!userId) {
    throw new Error("Invalid token payload");
  }

  // 3. データベースからユーザーを検索
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    // 4. パスワードなど、クライアントに返すべきでない情報は除外する
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
