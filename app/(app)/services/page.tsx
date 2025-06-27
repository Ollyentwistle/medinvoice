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
import { Service } from "@/lib/generated/prisma/client";
import { ServiceBase } from "@/models/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import AddEditServiceModal from "./components/AddEditServicesModal";
import {
  addService,
  deleteService,
  fetchServices,
  updateService,
} from "./services.queries";

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [serviceBase, setServiceBase] = useState<ServiceBase>({
    name: "",
    price: 0,
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const addMutation = useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsAddEditModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ServiceBase }) =>
      updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setIsAddEditModalOpen(false);
      resetServiceBase();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetServiceBase = () => {
    setServiceBase({
      name: "",
      price: 0,
    });
  };

  const handleUpdatePress = (service: ServiceBase) => {
    setServiceBase(service);
    setIsAddEditModalOpen(true);
  };

  const handleAddUpdate = (service: ServiceBase) => {
    console.log("service to add: ", service);
    if (service.id) {
      updateMutation.mutate({ id: service.id, data: service });
    } else {
      addMutation.mutate(service);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Services</h1>
            <p className="text-slate-600">Manage your service database</p>
          </div>
        </div>

        <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetServiceBase}>
              <Plus className="h-4 w-4 mr-2" />
              {"Add Service"}
            </Button>
          </DialogTrigger>
          <AddEditServiceModal
            setIsOpen={setIsAddEditModalOpen}
            serviceBase={serviceBase}
            onSave={handleAddUpdate}
            onCancel={resetServiceBase}
          />
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Services Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-slate-500"
                >
                  {searchTerm
                    ? "No services found matching your search."
                    : "No services yet. Add your first service to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service: Service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="text-slate-600">
                    £{service.price}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdatePress({
                            id: service.id,
                            name: service.name,
                            price: service.price,
                          })
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(service.id)}
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
