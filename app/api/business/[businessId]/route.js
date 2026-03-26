import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { businessId } = await params;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, name: true, city: true, phone: true },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found!" },
        { status: 404 }
      );
    }

    const services = await prisma.service.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ business, services });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error!" },
      { status: 500 }
    );
  }
}