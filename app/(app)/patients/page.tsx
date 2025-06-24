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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import AddEditPatientModal from "./components/AddEditPatientModal";
import {
  addPatient,
  deletePatient,
  fetchPatients,
  updatePatient,
} from "./patients.queries";

export interface PatientBase {
  id?: number;
  name: string;
  email: string;
}

export default function PatientsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [patientBase, setPatientBase] = useState<PatientBase>({
    email: "",
    name: "",
  });

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  const addMutation = useMutation({
    mutationFn: addPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setIsAddEditModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatientBase }) =>
      updatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setIsAddEditModalOpen(false);
      resetPatientBase();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
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

  const handleAddUpdate = (patient: PatientBase) => {
    if (patient.id) {
      updateMutation.mutate({ id: patient.id, data: patient });
    } else {
      addMutation.mutate(patient);
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
                        onClick={() => deleteMutation.mutate(patient.id)}
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
