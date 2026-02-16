import { getProperties } from "@/server/services/propertiesService";
import { NextRequest, NextResponse } from "next/server"; // NextRequestをインポート

export async function GET(request: NextRequest): Promise<NextResponse> {
  // URLのクエリパラメータを取得
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  const sortBy = searchParams.get("sortBy") || "price_asc"; // デフォルトのソート順を設定
  const withinNeighborhood = searchParams.get("withinNeighborhood") === "true";
  const filters: { [key: string]: any } = {};

  for (const [key, value] of searchParams.entries()) {
    // ページネーションとソート以外のパラメータをfiltersオブジェクトに追加
    if (key !== "limit" && key !== "offset" && key !== "sort") {
      // "layouts"は配列として扱う
      if (key === "layouts") {
        filters[key] = searchParams.getAll("layouts");
      } else {
        filters[key] = value;
      }
    }
  }

  // サービスにlimitとoffsetを渡す
  const { properties, count } = await getProperties({
    limit,
    offset,
    withinNeighborhood,
    sortBy,
    filters,
  });

  return NextResponse.json({
    properties,
    count,
  });
}
