import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: "All fields required!" }, { status: 400 });

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return NextResponse.json({ error: "Admin not found!" }, { status: 404 });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return NextResponse.json({ error: "Incorrect password!" }, { status: 401 });

    return NextResponse.json({ message: "Login successful!", admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}