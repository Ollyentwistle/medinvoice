import { PrismaClient } from "@/lib/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // const data = await req.json();

    const patients = await prisma.patient.findMany();

    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, name } = data;

    const newPatient = await prisma.patient.create({
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, email, name } = data;

    const updatedPatient = await prisma.patient.update({
      where: {
        id,
      },
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(updatedPatient, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    const { id } = data;

    const res = await prisma.patient.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
