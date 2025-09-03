import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma"; // PrismaClientのインスタンス
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userWithRole = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { role: true },
});
type UserWithRole = Prisma.UserGetPayload<typeof userWithRole>;

// フロントエンドに最終的に返したいユーザープロファイルの型
export type UserProfile = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  avatarUrl: string | null;
};

interface UserPayload {
  userId: number;
  name: string;
  avatar_url?: string;
  roleId: number;
  roleName: string;
}

/**
 * JWTを検証し、該当するユーザー情報を返す関数
 * @param token JWT文字列
 * @returns ユーザー情報（パスワードは除く）
 */
export async function getUserFromToken(
  token: string
): Promise<UserProfile | null> {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as UserPayload;
  console.log(decoded);
  const userId = decoded.userId;
  if (!userId) {
    throw new Error("Invalid token payload");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null,
    },
    include: {
      role: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  console.log("user", user);
  return transformUserToProfile(user);
}

function transformUserToProfile(user: UserWithRole): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.role.id === 2,
    avatarUrl: user?.avatarUrl,
  };
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
