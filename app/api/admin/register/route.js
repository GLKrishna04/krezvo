import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) return NextResponse.json({ error: "All fields required!" }, { status: 400 });

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Admin already exists!" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({ data: { name, email, password: hashedPassword } });

    return NextResponse.json({ message: "Admin created!", admin: { id: admin.id, name: admin.name, email: admin.email } }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}