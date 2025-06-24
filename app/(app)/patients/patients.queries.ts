import { Patient } from "@/lib/generated/prisma/client";
import { PatientBase } from "@/models/patients";

export async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch("/api/patients");
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

export async function addPatient(data: PatientBase) {
  const res = await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add patient");
  return res.json();
}

export async function updatePatient(id: number, data: PatientBase) {
  const res = await fetch("/api/patients", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update patient");
  return res.json();
}

export async function deletePatient(id: number) {
  const res = await fetch("/api/patients", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete patient");
  return res.json();
}
