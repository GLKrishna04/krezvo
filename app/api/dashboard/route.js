import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId required!" },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { businessId },
      include: { service: true },
      orderBy: { createdAt: "desc" },
    });

    const services = await prisma.service.findMany({
      where: { businessId },
    });

    return NextResponse.json({ bookings, services });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error!" },
      { status: 500 }
    );
  }
}