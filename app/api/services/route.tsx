import { prisma } from "@/lib/prisma";
import { ServiceBase } from "@/models/services";
import { NextRequest, NextResponse } from "next/server";
import { fetchAllServices } from "./services.funcs";

export async function GET(req: NextRequest) {
  try {
    const services = await fetchAllServices();

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, price }: ServiceBase = data;

    const newService = await prisma.service.create({
      data: {
        name,
        price,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, name, price }: ServiceBase = data;

    const updatedService = await prisma.service.update({
      where: {
        id,
      },
      data: {
        name,
        price,
      },
    });

    return NextResponse.json(updatedService, { status: 201 });
  } catch (error) {
    console.error("Error updating service:", error);
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

    const res = await prisma.service.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
