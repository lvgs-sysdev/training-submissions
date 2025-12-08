import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { handleApiError } from "@/shared/utils/errorHandler";

// 駅一覧を返すAPI
export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(stations);
  } catch (error) {
    return handleApiError(error, "Failed to fetch stations");
  }
}
