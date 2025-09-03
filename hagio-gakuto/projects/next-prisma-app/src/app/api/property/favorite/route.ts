import { getAuth } from "@/server/services/authService";
import { toggleFavorite } from "@/server/services/favoriteService";
import { NextRequest, NextResponse } from "next/server"; // NextRequestをインポート

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { user } = await getAuth();
  if (!user) {
    return NextResponse.json(
      { message: "認証されていません" },
      { status: 401 }
    );
  }
  const userId = user.userId;
  const body = await request.json();
  const { propertyId } = body;

  if (!propertyId) {
    return NextResponse.json({ message: "物件IDは必須です" }, { status: 400 });
  }

  const status = await toggleFavorite({
    userId: userId,
    unitId: propertyId,
  });

  return NextResponse.json({ message: status }, { status: 200 });
}
