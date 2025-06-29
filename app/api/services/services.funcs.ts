// lib/db/payments.ts (or queries/payments.queries.ts)
import { Service } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function fetchAllServices(): Promise<Service[]> {
  return await prisma.service.findMany();
}
