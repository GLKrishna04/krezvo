import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { customerName, customerPhone, date, time, businessId, serviceId } = await request.json();

    if (!customerName || !customerPhone || !date || !time || !businessId || !serviceId) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        customerName,
        customerPhone,
        date,
        time,
        businessId,
        serviceId,
        status: "confirmed",
      },
    });

    return NextResponse.json({ message: "Booking confirmed!", booking }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}