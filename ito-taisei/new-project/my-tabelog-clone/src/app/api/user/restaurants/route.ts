import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userWithRestaurants = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        createdRestaurants: {
          include: {
            genre: true,
            station: true,
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    if (!userWithRestaurants) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(userWithRestaurants.createdRestaurants, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
