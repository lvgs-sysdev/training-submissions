import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = (await cookies()).get("session");

    if (!session) {
      return NextResponse.json({ msg: "ログインしていません。" });
    }

    const sessionId = session.value;

    await prisma.sessions.delete({
      where: {
        id: sessionId,
      },
    });

    (await cookies()).delete("session");

    return NextResponse.json({ msg: "ログアウトしました。" });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      {
        error: "ログアウト中にエラーが発生しました。管理者に確認してください。",
      },
      { status: 500 }
    );
  }
}
