import { prisma } from "@/lib/prisma";
import { PaymentBase } from "@/models/payments";
import { NextRequest, NextResponse } from "next/server";
import { fetchAllPayments } from "./payments.funcs";

export async function GET(req: NextRequest) {
  try {
    const payments = await fetchAllPayments();

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { patientId, serviceId, date, isPaid }: PaymentBase = data;

    const newPayment = await prisma.payment.create({
      data: {
        patientId,
        serviceId,
        date,
        isPaid,
      },
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, patientId, serviceId, date, isPaid }: PaymentBase = data;

    const updatedPayment = await prisma.payment.update({
      where: {
        id,
      },
      data: {
        patientId,
        serviceId,
        date,
        isPaid,
      },
    });

    return NextResponse.json(updatedPayment, { status: 201 });
  } catch (error) {
    console.error("Error updating payment:", error);
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

    const res = await prisma.payment.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
