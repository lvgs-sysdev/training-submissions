import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { handleApiError } from "@/shared/utils/errorHandler";

// ジャンル一覧を返すAPI
export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(genres);
  } catch (error) {
    return handleApiError(error, "Failed to fetch genres");
  }
}
