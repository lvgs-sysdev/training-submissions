"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { formatRestaurantResponse } from "@/shared/utils/restaurantResponse";
import { handleApiError } from "@/shared/utils/errorHandler";

// 新着レストランを返すAPI
export async function GET() {
  // 新着レストランを6件取得（created_at降順）
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isPublic: true,
      },
      orderBy: { created_at: "desc" },
      take: 6,
      include: { genre: true, station: true },
    });
    // 必要な情報のみ返す
    const result = restaurants.map(formatRestaurantResponse);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error, "Failed to fetch new arrivals");
  }
}
