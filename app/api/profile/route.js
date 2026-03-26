import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(request) {
  try {
    const { businessId, name, phone, city } = await request.json();

    if (!businessId || !name) {
      return NextResponse.json(
        { error: "Business ID and name are required!" },
        { status: 400 }
      );
    }

    const updated = await prisma.business.update({
      where: { id: businessId },
      data: { name, phone: phone || null, city: city || null },
      select: { id: true, name: true, email: true, phone: true, city: true },
    });

    return NextResponse.json({ message: "Profile updated!", business: updated });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error!" },
      { status: 500 }
    );
  }
}