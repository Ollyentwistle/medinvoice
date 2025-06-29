"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/context/UserContext";
import { Payment } from "@/lib/generated/prisma/client";
import { PaymentBase } from "@/models/payments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { fetchPatients } from "../patients/patients.queries";
import { fetchServices } from "../services/services.queries";
import {
  addPaymentt,
  deletePayment,
  fetchPayments,
  updatePayment,
} from "./payments.queries";

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentBase, setPaymentBase] = useState<PaymentBase>({
    patientId: -1,
    serviceId: -1,
    date: new Date().toISOString().split("T")[0],
    isPaid: false,
  });

  const { user } = useUser();

  const resetPaymentBase = () => {
    setPaymentBase({
      patientId: -1,
      serviceId: -1,
      date: new Date().toISOString().split("T")[0],
      isPaid: false,
    });
  };

  const { data: payments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });

  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const addMutation = useMutation({
    mutationFn: addPaymentt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setIsAddModalOpen(false);
      resetPaymentBase();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PaymentBase }) =>
      updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setIsAddModalOpen(false);
      resetPaymentBase();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  const enrichedPayments = useMemo(() => {
    return payments.map((payment) => {
      const patient = patients.find((p) => p.id === payment.patientId);
      const service = services.find((s) => s.id === payment.serviceId);
      return {
        ...payment,
        patientName: patient?.name ?? "Unknown",
        serviceName: service?.name ?? "Unknown",
        servicePrice: service?.price ?? 0,
      };
    });
  }, [payments, patients, services]);

  const filteredPayments = useMemo(() => {
    return enrichedPayments.filter(
      (payment) =>
        payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enrichedPayments, searchTerm]);

  const handleAddPayment = () => {
    if (paymentBase.patientId && paymentBase.serviceId) {
      addMutation.mutate(paymentBase);
      setIsAddModalOpen(false);
    }
  };

  const togglePaymentStatus = (payment: Payment) => {
    updateMutation.mutate({
      id: payment.id,
      data: {
        patientId: payment.patientId,
        serviceId: payment.serviceId,
        date: payment.date,
        isPaid: !payment.isPaid,
      },
    });
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
            <p className="text-slate-600">Track and manage patient payments</p>
          </div>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Payment</DialogTitle>
              <DialogDescription>
                Record a new payment for a patient service.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Select Patient</Label>
                <Select
                  value={String(paymentBase.patientId)}
                  onValueChange={(value) =>
                    setPaymentBase({ ...paymentBase, patientId: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={String(patient.id)}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Select Service</Label>
                <Select
                  value={String(paymentBase.serviceId)}
                  onValueChange={(value) =>
                    setPaymentBase({ ...paymentBase, serviceId: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={String(service.id)}>
                        {service.name} - £{service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={paymentBase.date}
                  onChange={(e) =>
                    setPaymentBase({ ...paymentBase, date: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paid"
                  checked={paymentBase.isPaid}
                  onCheckedChange={(checked) =>
                    setPaymentBase({
                      ...paymentBase,
                      isPaid: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="paid">Mark as paid</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPayment}>Add Payment</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Payments Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-slate-500"
                >
                  {searchTerm
                    ? "No payments found matching your search."
                    : "No payments yet. Add your first payment to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => {
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.patientName}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {payment.serviceName}
                    </TableCell>
                    <TableCell className="font-medium">
                      £{payment.servicePrice}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(payment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={payment.isPaid ? "default" : "destructive"}
                      >
                        {payment.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!payment.isPaid && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePaymentStatus(payment)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
