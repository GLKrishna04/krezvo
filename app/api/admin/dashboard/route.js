import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { bookings: true } } },
    });

    const totalBookings = await prisma.booking.count();
    const totalStaff = await prisma.staff.count();
    const allBookings = await prisma.booking.findMany({ include: { service: true } });
    const totalRevenue = allBookings.reduce((acc, b) => acc + (b.service?.price || 0), 0);

    return NextResponse.json({
      stats: { totalBusinesses: businesses.length, totalBookings, totalStaff, totalRevenue },
      businesses,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}