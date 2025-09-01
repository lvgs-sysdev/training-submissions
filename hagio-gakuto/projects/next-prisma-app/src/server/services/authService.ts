import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma"; // PrismaClientのインスタンス
import { cookies } from "next/headers";

interface UserPayload {
  userId: number;
  name: string;
  avatar_url?: string;
}

/**
 * JWTを検証し、該当するユーザー情報を返す関数
 * @param token JWT文字列
 * @returns ユーザー情報（パスワードは除く）
 */
export async function getUserFromToken(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as UserPayload;
  const userId = decoded.userId;
  if (!userId) {
    throw new Error("Invalid token payload");
  }
  const user = await prisma.user.findMany({
    where: {
      id: userId,
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

/**
 * サーバーサイドで現在の認証状態を取得する共通関数
 * @returns 認証済みの場合はユーザー情報、そうでなければnull
 */
export const getAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return { user: null };
  }

  // トークンを検証・デコード
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as UserPayload;
  return { user: decoded };
};
