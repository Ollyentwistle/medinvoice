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
import { ServiceBase } from "@/models/services";
import { useEffect, useState } from "react";

interface AddEditServiceModalProps {
  setIsOpen: (value: boolean) => void;
  serviceBase: ServiceBase;
  onSave: (patient: ServiceBase) => void;
  onCancel?: () => void;
}

export default function AddEditServiceModal({
  setIsOpen,
  serviceBase,
  onSave,
  onCancel,
}: AddEditServiceModalProps) {
  const [service, setService] = useState<ServiceBase>(serviceBase);

  useEffect(() => {
    setService(serviceBase);
  }, [serviceBase]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {!serviceBase.id ? "Add New Service" : `Update ${serviceBase.name}`}
        </DialogTitle>
        <DialogDescription>
          Enter the service's details to
          {!serviceBase.id ? "add them to" : "update them in"} your database.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Service Name</Label>
          <Input
            id="name"
            value={service.name}
            onChange={(e) => setService({ ...service, name: e.target.value })}
            placeholder="Enter service name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Price</Label>
          <Input
            id="price"
            type="number"
            value={service.price}
            onChange={(e) =>
              setService({ ...service, price: Number(e.target.value) })
            }
            placeholder="0"
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
          <Button onClick={() => onSave(service)}>
            {!serviceBase.id ? "Add Service" : "Update Service"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
