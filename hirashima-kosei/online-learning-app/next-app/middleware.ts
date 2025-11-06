import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "./generated/prisma";

const prismaClient = new PrismaClient();

export default async function middleware(request: NextRequest) {
  const session = (await cookies()).get("session");
  let isValidSession = false;

  if (!!session) {
    const sessionId = session?.value;
    const expiresAt = await prismaClient.sessions.findUnique({
      where: { id: sessionId },
      select: { expires_at: true },
    });

    if (expiresAt && expiresAt.expires_at > new Date()) {
      isValidSession = true;
    }
  }

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  if (isAuthPage) {
    if (!!session && isValidSession) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return null;
  }

  const isCoursePage = request.nextUrl.pathname.startsWith("/course");
  if (isCoursePage) {
    if ((!!session && isValidSession) || !session) return null;
  }

  if (!isValidSession) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));

    // セッション期限切れの場合はparamsとしてメッセージ送信
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "message",
      "セッションの有効期限が切れました。再度ログインしてください。"
    );
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/course/:path",
    "/lecture",
    "/lecture/:path",
    "/myLearning/:path",
    "/myLecture/:path",
    "/login",
    "/register",
  ],
  // DB処理のためにランタイムをnodejsに変更
  runtime: "nodejs",
};
