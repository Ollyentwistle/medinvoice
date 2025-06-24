import { Payment } from "@/lib/generated/prisma/client";
import { PaymentBase } from "@/models/payments";

export async function fetchPayments(): Promise<Payment[]> {
  const res = await fetch("/api/payments");
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}

export async function addPaymentt(data: PaymentBase) {
  const res = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add payment");
  return res.json();
}

export async function updatePayment(id: number, data: PaymentBase) {
  const res = await fetch("/api/payments", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update payment");
  return res.json();
}

export async function deletePayment(id: number) {
  const res = await fetch("/api/payments", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete payment");
  return res.json();
}
