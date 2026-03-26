import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required!" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { email },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Email not found!" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, business.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect password!" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Login successful!",
      business: {
        id: business.id,
        name: business.name,
        email: business.email,
        phone: business.phone,
        city: business.city,
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error!" },
      { status: 500 }
    );
  }
}