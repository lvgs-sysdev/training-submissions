import { NextRequest, NextResponse } from "next/server";
// Utilサービスから、型定義とメイン関数をインポート

import { getAuth } from "@/server/services/authService";
import { PropertyFilters } from "@/types/PropertyFiltersType";
import { getFilteredUnits } from "@/server/services/propertyUtilService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    //ページネーションとソートのパラメータを解析
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const sortBy = searchParams.get("sortBy") || "price_asc";
    const withinNeighborhood =
      searchParams.get("withinNeighborhood") === "true";

    //絞り込み条件（filters）をオブジェクトにまとめる
    const filters: PropertyFilters = {
      priceMin: Number(searchParams.get("priceMin")) || undefined,
      priceMax: Number(searchParams.get("priceMax")) || undefined,
      areaMin: Number(searchParams.get("area")) || undefined,
      ageMax: Number(searchParams.get("age")) || undefined,
      walkMax: Number(searchParams.get("walk")) || undefined,
      floorMin: searchParams.get("floor") === "true",
      layouts: searchParams.getAll("layouts"),
      features: searchParams.getAll("features"),
    };

    const { user } = await getAuth();

    const userId = user?.userId;

    const { properties, count } = await getFilteredUnits({
      userId,
      limit,
      offset,
      sortBy,
      withinNeighborhood,
      ...filters, // 絞り込み条件を渡す
    });

    return NextResponse.json({
      properties,
      count,
    });
  } catch (error) {
    console.error("Failed to get properties:", error);
    return NextResponse.json(
      { message: "物件の取得に失敗しました。" },
      { status: 500 }
    );
  }
}
