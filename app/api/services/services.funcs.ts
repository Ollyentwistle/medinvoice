// lib/db/payments.ts (or queries/payments.queries.ts)
import { Payment, Service } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getAllServices(): Promise<Service[]> {
  return await prisma.service.findMany();
}
