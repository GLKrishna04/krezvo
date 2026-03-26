import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email మరియు Password enter చేయండి!" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { email },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Email found కాలేదు!" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, business.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Password తప్పు!" },
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