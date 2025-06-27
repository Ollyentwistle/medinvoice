import { prisma } from "@/lib/prisma";
import { PatientBase } from "@/models/patients";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const patients = await prisma.patient.findMany();

    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, name }: PatientBase = data;

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
    const { id, email, name }: PatientBase = data;

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
    console.error("Error updating patient:", error);
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
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
