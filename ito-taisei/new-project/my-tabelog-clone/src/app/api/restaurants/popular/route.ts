"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { formatRestaurantResponse } from "@/shared/utils/restaurantResponse";
import { handleApiError } from "@/shared/utils/errorHandler";

// 人気ジャンルのレストランをランダムでピックして返すAPI
export async function GET() {
  // genreごとのレストラン数を集計
  try {
    const genreCounts = await prisma.restaurant.groupBy({
      by: ["genre_id"],
      _count: { genre_id: true },
      where: {
        isPublic: true,
      },
      orderBy: { _count: { genre_id: "desc" } },
    });
    if (!genreCounts.length) return NextResponse.json([]);

    // 最も登録数が多いgenre_idを取得
    const mostPopularGenreId = genreCounts[0].genre_id;

    // そのジャンルのレストランを取得
    const restaurants = await prisma.restaurant.findMany({
      where: { genre_id: mostPopularGenreId, isPublic: true },
      include: { genre: true, station: true },
    });
    if (!restaurants.length) return NextResponse.json([]);

    // ランダムで6件ピック
    const shuffled = restaurants.sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 6);

    // 必要な情報のみ返す
    const result = picked.map(formatRestaurantResponse);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error, "Failed to fetch popular genre restaurants");
  }
}
