import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "./generated/prisma";

const prismaClient = new PrismaClient();

export default async function middleware(request: NextRequest) {
  const session = (await cookies()).get("session");
  let isValidSession = false;

  if (!!session) {
    const sessionId = session?.value;
    const sessionData = await prismaClient.sessions.findUnique({
      where: { id: sessionId },
      select: { expires_at: true, user_id: true },
    });

    if (sessionData && sessionData.expires_at > new Date()) {
      isValidSession = true;
    }

    if (isValidSession) {
      if (request.nextUrl.pathname.startsWith("/myLearning/")) {
        const requestUserId = request.nextUrl.pathname.split("/")[2];
        if (requestUserId !== String(sessionData?.user_id))
          return NextResponse.redirect(new URL("/accessDenied", request.url));
      }

      if (request.nextUrl.pathname.startsWith("/myLecture/")) {
        const requestUserId = request.nextUrl.pathname.split("/")[2];
        if (requestUserId !== String(sessionData?.user_id))
          return NextResponse.redirect(new URL("/accessDenied", request.url));
      }

      if (request.nextUrl.pathname.startsWith("/lecture/")) {
        const requestLectureId = request.nextUrl.pathname.slice(
          9,
          request.nextUrl.pathname.length
        );

        const lectureData = await prismaClient.courses.findUnique({
          where: { id: Number(requestLectureId) },
          select: { user_id: true },
        });

        if (!lectureData || lectureData?.user_id !== sessionData?.user_id)
          return NextResponse.redirect(new URL("/accessDenied", request.url));
      }
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
  runtime: "nodejs",
};
