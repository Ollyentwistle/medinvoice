import { Service } from "@/lib/generated/prisma/client";
import { ServiceBase } from "@/models/services";

export async function fetchServices(): Promise<Service[]> {
  const res = await fetch("/api/services");
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function addService(data: ServiceBase) {
  console.log("adding service");
  const res = await fetch("/api/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  console.log(res);
  if (!res.ok) throw new Error("Failed to add service");
  return res.json();
}

export async function updateService(id: number, data: ServiceBase) {
  const res = await fetch("/api/services", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
}

export async function deleteService(id: number) {
  const res = await fetch("/api/services", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete service");
  return res.json();
}
