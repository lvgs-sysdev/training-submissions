import { getAuth } from "@/server/services/authService";
import { getFavoriteProperties } from "@/server/services/favoriteService";
import { NextRequest, NextResponse } from "next/server"; // NextRequestをインポート

export async function GET(request: NextRequest): Promise<NextResponse> {
  // URLのクエリパラメータを取得
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  const sortBy = searchParams.get("sortBy") || "price_asc"; // デフォルトのソート順を設定
  const withinNeighborhood = searchParams.get("withinNeighborhood") === "true";
  const { user } = await getAuth();
  if (!user) {
    return NextResponse.json(
      { message: "認証されていません" },
      { status: 401 }
    );
  }
  const userId = user.userId;

  const result = await getFavoriteProperties({
    limit,
    offset,
    withinNeighborhood,
    sortBy,
    userId,
  });

  if (!result) {
    // もし null だった場合、エラーを返すか、空のデータを返す
    return NextResponse.json({ properties: [], count: 0 });
  }

  const { properties, count } = result;

  return NextResponse.json({
    properties,
    count,
  });
}
