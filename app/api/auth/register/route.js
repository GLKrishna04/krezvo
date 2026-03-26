import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password, phone, city } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, Email, Password are required!" },
        { status: 400 }
      );
    }

    const existing = await prisma.business.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const business = await prisma.business.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        city: city || null,
      },
    });

    return NextResponse.json(
      { message: "Account created!", id: business.id },
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