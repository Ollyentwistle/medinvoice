"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { PatientBase } from "../page";

interface AddEditPatientModalProps {
  setIsOpen: (value: boolean) => void;
  patientBase: PatientBase;
  onSave: (patient: PatientBase) => void;
  onCancel?: () => void;
}

export default function AddEditPatientModal({
  setIsOpen,
  patientBase,
  onSave,
  onCancel,
}: AddEditPatientModalProps) {
  const [patient, setPatient] = useState<PatientBase>(patientBase);

  useEffect(() => {
    setPatient(patientBase);
  }, [patientBase]);
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {!patientBase.id ? "Add New Patient" : `Update ${patientBase.name}`}
        </DialogTitle>
        <DialogDescription>
          Enter the patient's details to
          {!patientBase.id ? "add them to" : "update them in"} your database.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={patient.name}
            onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            placeholder="Enter patient's full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={patient.email}
            onChange={(e) => setPatient({ ...patient, email: e.target.value })}
            placeholder="patient@email.com"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              onCancel && onCancel;
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => onSave(patient)}>
            {!patientBase.id ? "Add Patient" : "Update Patient"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
