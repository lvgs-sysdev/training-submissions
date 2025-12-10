"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@/generated/client";
import { formatRestaurantResponse } from "@/shared/utils/restaurantResponse";
import { handleApiError } from "@/shared/utils/errorHandler";

export async function GET() {
  try {
    type RestaurantWithRelations = Prisma.RestaurantGetPayload<{
      include: { genre: true; station: true };
    }>;

    // 人気ジャンル取得処理
    const genreCounts = await prisma.restaurant.groupBy({
      by: ["genre_id"],
      _count: { genre_id: true },
      orderBy: { _count: { genre_id: "desc" } },
    });

    let popularRaw: RestaurantWithRelations[] = [];

    // 人気レストランの取得処理
    if (genreCounts.length > 0) {
      const mostPopularGenreId = genreCounts[0].genre_id;
      const candidates = await prisma.restaurant.findMany({
        where: { genre_id: mostPopularGenreId },
        include: { genre: true, station: true },
      });
      popularRaw = candidates.sort(() => Math.random() - 0.5).slice(0, 6);
    }

    // 新着レストランの取得
    const newArrivalsRaw = await prisma.restaurant.findMany({
      orderBy: { created_at: "desc" },
      take: 6,
      include: { genre: true, station: true },
    });

    // まとめて返す
    return NextResponse.json({
      popular: popularRaw.map(formatRestaurantResponse),
      newArrivals: newArrivalsRaw.map(formatRestaurantResponse),
    });
  } catch (error) {
    return handleApiError(error, "Failed to fetch top feed");
  }
}
