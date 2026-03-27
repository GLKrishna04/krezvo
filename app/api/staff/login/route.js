import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: "All fields required!" }, { status: 400 });

    const staff = await prisma.staff.findUnique({ where: { email } });
    if (!staff) return NextResponse.json({ error: "Staff not found!" }, { status: 404 });
    if (!staff.password) return NextResponse.json({ error: "Password not set! Contact your manager." }, { status: 401 });

    const isValid = await bcrypt.compare(password, staff.password);
    if (!isValid) return NextResponse.json({ error: "Incorrect password!" }, { status: 401 });

    return NextResponse.json({
      message: "Login successful!",
      staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role, businessId: staff.businessId },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}