import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request) {
  try {
    const { rating, comment, customerName, businessId, bookingId } = await request.json();

    if (!rating || !customerName || !businessId) {
      return NextResponse.json({ error: "Rating and name are required!" }, { status: 400 });
    }

    const existing = bookingId ? await prisma.review.findUnique({ where: { bookingId } }) : null;
    if (existing) {
      return NextResponse.json({ error: "Review already submitted!" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        customerName,
        businessId,
        bookingId: bookingId || `manual-${Date.now()}`,
      },
    });

    return NextResponse.json({ message: "Review submitted!", review }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json({ error: "businessId required!" }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, name: true, city: true },
    });

    return NextResponse.json({ reviews, business });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}