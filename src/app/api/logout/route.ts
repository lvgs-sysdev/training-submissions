import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // 'session_token'という名前のクッキーを削除
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  console.log("Logout successful, session token deleted");
  return NextResponse.json({ message: "ログアウトしました" }, { status: 200 });
}
