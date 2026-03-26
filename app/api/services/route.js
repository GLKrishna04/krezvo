import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request) {
  try {
    const { name, price, duration, businessId } = await request.json();

    if (!name || !price || !duration || !businessId) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: { name, price, duration, businessId },
    });

    return NextResponse.json(
      { message: "Service added!", service },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error!" },
      { status: 500 }
    );
  }
}

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

    const services = await prisma.service.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ services });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error!" },
      { status: 500 }
    );
  }
}