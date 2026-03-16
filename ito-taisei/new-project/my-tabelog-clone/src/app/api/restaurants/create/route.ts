import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import { restaurantSchema } from "@/features/user/schema";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const validationResult = restaurantSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return NextResponse.json({ error: errorMessages }, { status: 400 });
    }

    const { name, address, genre_id, station_id } = validationResult.data;

    const validStationId =
      station_id && station_id !== "" ? Number(station_id) : null;

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        genre_id,
        station_id: validStationId,
        latitude: 35.681236,
        longitude: 139.767125,
        createdById: user.id,
        isPublic: false,
      },
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error("Restaurant Create Error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
