// lib/db/payments.ts (or queries/payments.queries.ts)
import { Payment } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function fetchAllPayments(): Promise<Payment[]> {
  return await prisma.payment.findMany();
}
