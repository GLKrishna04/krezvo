import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { name, email, password, phone, city } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, Email, Password తప్పనిసరి!" },
        { status: 400 }
      );
    }

    const existing = await prisma.business.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "ఈ email already registered!" },
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