import { getUserFromToken } from "../../../server/services/authService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
/**
 * ユーザー情報を取得するAPIエンドポイント
 * @returns ユーザー情報（パスワードは除く）
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // try...catchを削除。もしgetUserFromTokenでエラーが発生すれば、
  // Next.jsが自動で500エラーを返す。
  const user = await getUserFromToken(token.value);
  return NextResponse.json(user);
}
