import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import { z } from "zod";
import { restaurantSchema } from "@/features/user/schema";

const updateRestaurantSchema = z.object({
  id: z.string().min(1, "IDが必要です"),
  name: restaurantSchema.shape.name,
  address: restaurantSchema.shape.address,
  genre_id: restaurantSchema.shape.genre_id,
  station_id: restaurantSchema.shape.station_id,
  link: z.string().optional().nullable().or(z.literal("")),
  opening_hours: z.string().optional().nullable().or(z.literal("")),
  average_rating: z.coerce.number().min(0).max(5).optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const validationResult = updateRestaurantSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      return NextResponse.json({ error: errorMessages }, { status: 400 });
    }

    const {
      id,
      name,
      address,
      genre_id,
      station_id,
      link,
      opening_hours,
      average_rating,
    } = validationResult.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validStationId =
      station_id && station_id !== "" ? Number(station_id) : null;

    const updated = await prisma.restaurant.updateMany({
      where: {
        id: id,
        createdById: user.id,
      },
      data: {
        name,
        address,
        genre_id,
        station_id: validStationId,
        link: link || null,
        opening_hours: opening_hours || null,
        average_rating: average_rating || 0,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Not found or permission denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
