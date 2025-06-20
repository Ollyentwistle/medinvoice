"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Check } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface Payment {
  id: string;
  patientName: string;
  serviceName: string;
  amount: number;
  date: string;
  paid: boolean;
}

const initialPayments: Payment[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    serviceName: "Teeth Whitening",
    amount: 200,
    date: "2024-01-15",
    paid: true,
  },
  {
    id: "2",
    patientName: "Michael Chen",
    serviceName: "Dental Cleaning",
    amount: 80,
    date: "2024-01-14",
    paid: false,
  },
  {
    id: "3",
    patientName: "Emma Williams",
    serviceName: "Root Canal",
    amount: 450,
    date: "2024-01-12",
    paid: true,
  },
  {
    id: "4",
    patientName: "David Brown",
    serviceName: "Dental Filling",
    amount: 120,
    date: "2024-01-10",
    paid: false,
  },
];

const patients = [
  { id: "1", name: "Sarah Johnson" },
  { id: "2", name: "Michael Chen" },
  { id: "3", name: "Emma Williams" },
  { id: "4", name: "David Brown" },
];

const services = [
  { id: "1", name: "Teeth Whitening", price: 200 },
  { id: "2", name: "Dental Cleaning", price: 80 },
  { id: "3", name: "Root Canal", price: 450 },
  { id: "4", name: "Dental Filling", price: 120 },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    patientId: "",
    serviceId: "",
    date: new Date().toISOString().split("T")[0],
    paid: false,
  });

  const filteredPayments = payments.filter(
    (payment) =>
      payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPayment = () => {
    if (newPayment.patientId && newPayment.serviceId) {
      const patient = patients.find((p) => p.id === newPayment.patientId);
      const service = services.find((s) => s.id === newPayment.serviceId);

      if (patient && service) {
        const payment: Payment = {
          id: Date.now().toString(),
          patientName: patient.name,
          serviceName: service.name,
          amount: service.price,
          date: newPayment.date,
          paid: newPayment.paid,
        };
        setPayments([...payments, payment]);
        setNewPayment({
          patientId: "",
          serviceId: "",
          date: new Date().toISOString().split("T")[0],
          paid: false,
        });
        setIsAddModalOpen(false);
      }
    }
  };

  const togglePaymentStatus = (id: string) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, paid: !payment.paid } : payment
      )
    );
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
                  value={newPayment.patientId}
                  onValueChange={(value) =>
                    setNewPayment({ ...newPayment, patientId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Select Service</Label>
                <Select
                  value={newPayment.serviceId}
                  onValueChange={(value) =>
                    setNewPayment({ ...newPayment, serviceId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
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
                  value={newPayment.date}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, date: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paid"
                  checked={newPayment.paid}
                  onCheckedChange={(checked) =>
                    setNewPayment({ ...newPayment, paid: checked as boolean })
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
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.patientName}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {payment.serviceName}
                  </TableCell>
                  <TableCell className="font-medium">
                    £{payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={payment.paid ? "default" : "destructive"}>
                      {payment.paid ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {!payment.paid && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePaymentStatus(payment.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Paid
                      </Button>
                    )}
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
