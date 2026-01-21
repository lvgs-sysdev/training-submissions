import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await req.json();

    if (!session?.user?.email || !id) {
      return NextResponse.json(
        { error: "不正なリクエストです" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    const deleteResult = await prisma.restaurant.deleteMany({
      where: {
        id: id,
        createdById: user.id,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "削除権限がないか、データが存在しません" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
