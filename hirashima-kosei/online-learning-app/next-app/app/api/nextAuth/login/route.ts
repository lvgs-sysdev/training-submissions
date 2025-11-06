import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

interface ApiError {
  code?: string;
  message: string;
}

// 認証の際、Next.jsのサーバーからクライアントにCookieを返すための処理
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードを入力してください。" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findFirst({
      where: {
        email: email,
        verified: 1,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります。" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります。" },
        { status: 401 }
      );
    }

    const sessionId = uuidv4();
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 1);

    await prisma.sessions.create({
      data: {
        id: sessionId,
        user_id: user.id,
        expires_at: expiresDate,
      },
    });

    (await cookies()).set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 28,
      sameSite: "lax",
    });

    const loginUser = { userId: user.id, userName: user.user_name };

    return NextResponse.json({
      msg: "ログイン成功！",
      loginUser,
    });
  } catch (err) {
    const apiError = err as ApiError;
    console.error("Login error:", err);

    if (apiError instanceof SyntaxError) {
      return NextResponse.json(
        { error: "リクエストの形式が正しくありません。" },
        { status: 400 }
      );
    }

    if (apiError.code === "P2002") {
      return NextResponse.json(
        { error: "セッションの作成に失敗しました。再度お試しください。" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "ログインできませんでした。システム担当者に問い合わせてください。",
      },
      { status: 500 }
    );
  }
}
