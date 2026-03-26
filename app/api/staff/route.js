import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) return NextResponse.json({ error: "businessId required!" }, { status: 400 });
    const staff = await prisma.staff.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ staff });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, phone, role, businessId } = await request.json();
    if (!name || !businessId) return NextResponse.json({ error: "Name is required!" }, { status: 400 });
    const staff = await prisma.staff.create({
      data: { name, email: email || null, phone: phone || null, role: role || "staff", businessId },
    });
    return NextResponse.json({ message: "Staff added!", staff }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required!" }, { status: 400 });
    await prisma.staff.delete({ where: { id } });
    return NextResponse.json({ message: "Staff deleted!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}