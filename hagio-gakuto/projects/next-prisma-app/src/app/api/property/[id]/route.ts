import { getAuth } from "@/server/services/authService";
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

  const { user } = await getAuth();
  if (!user) {
    return NextResponse.json(
      { message: "認証されていません" },
      { status: 401 }
    );
  }
  const userId = user.userId;
  const property = await getPropertyById({
    id,
    userId,
  });

  return NextResponse.json(property);
}
