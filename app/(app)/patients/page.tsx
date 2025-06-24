"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Patient } from "@/lib/generated/prisma/client";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddEditPatientModal from "./components/AddEditPatientModal";

export interface PatientBase {
  id?: number;
  name: string;
  email: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [patientBase, setPatientBase] = useState<PatientBase>({
    email: "",
    name: "",
  });

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetPatientBase = () => {
    setPatientBase({
      email: "",
      name: "",
    });
  };

  const handleUpdatePress = (patient: PatientBase) => {
    setPatientBase(patient);
    setIsAddEditModalOpen(true);
  };

  const handleAddPatient = async (patient: PatientBase) => {
    if (patient.name && patient.email) {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: patient.email,
          name: patient.name,
        }),
      });

      const result = await res.json();
      setIsAddEditModalOpen(false);
    }
  };

  const handleUpdatePatient = async (id: number, patientBase: PatientBase) => {
    if (patientBase.name && patientBase.email) {
      const res = await fetch("/api/patients", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          email: patientBase.email,
          name: patientBase.name,
        }),
      });

      const result = await res.json();

      setIsAddEditModalOpen(false);
      resetPatientBase();
    }
  };

  const handleDeletePatient = async (id: number) => {
    const res = await fetch("/api/patients", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    const result = await res.json();
    setPatients(patients.filter((p) => p.id !== id));
  };

  const handleFetchPatients = async () => {
    const res = await fetch("/api/patients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    setPatients(result);
  };

  useEffect(() => {
    handleFetchPatients();
  }, []);

  const handleAddUpdate = (patient: PatientBase) => {
    console.log(patient);
    if (patient.id) {
      handleUpdatePatient(patient.id, patient);
    } else {
      handleAddPatient(patient);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
            <p className="text-slate-600">Manage your patient database</p>
          </div>
        </div>

        <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetPatientBase}>
              <Plus className="h-4 w-4 mr-2" />
              {"Add Patient"}
            </Button>
          </DialogTrigger>
          <AddEditPatientModal
            setIsOpen={setIsAddEditModalOpen}
            patientBase={patientBase}
            onSave={handleAddUpdate}
            onCancel={resetPatientBase}
          />
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Patients Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-slate-500"
                >
                  {searchTerm
                    ? "No patients found matching your search."
                    : "No patients yet. Add your first patient to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient: Patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell className="text-slate-600">
                    {patient.email}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdatePress({
                            id: patient.id,
                            email: patient.email,
                            name: patient.name,
                          })
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePatient(patient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
