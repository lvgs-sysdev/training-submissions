import { getPropertyById } from "@/server/services/propertyService";
import { NextRequest, NextResponse } from "next/server"; // NextRequestをインポート

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  // URLのクエリパラメータを取得
  const id = params.id;

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  // サービスにlimitとoffsetを渡す
  const properties = await getPropertyById({
    id,
  });

  console.log("bbbbb", properties);

  return NextResponse.json(properties);
}
