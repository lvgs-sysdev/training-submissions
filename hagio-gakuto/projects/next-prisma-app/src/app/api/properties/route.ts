import { getProperties } from "@/server/services/propertiesServer";
import { NextRequest, NextResponse } from "next/server"; // NextRequestをインポート

export async function GET(request: NextRequest): Promise<NextResponse> {
  // URLのクエリパラメータを取得
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  const sortBy = searchParams.get("sortBy") || "price_asc"; // デフォルトのソート順を設定
  const withinNeighborhood = searchParams.get("withinNeighborhood") === "true";

  // サービスにlimitとoffsetを渡す
  const properties = await getProperties({
    limit,
    offset,
    withinNeighborhood,
    sortBy,
  });

  return NextResponse.json(properties);
}
