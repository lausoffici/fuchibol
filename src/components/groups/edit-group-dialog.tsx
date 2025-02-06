"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { updateGroup } from "@/app/actions/groups";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface EditGroupFormValues {
  name: string;
}

interface EditGroupDialogProps {
  groupId: string;
  currentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGroupDialog({
  groupId,
  currentName,
  open,
  onOpenChange,
}: EditGroupDialogProps) {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<EditGroupFormValues>();

  useEffect(() => {
    if (open) {
      reset({ name: currentName });
    }
  }, [open, currentName, reset]);

  async function onSubmit(data: EditGroupFormValues) {
    try {
      await updateGroup(groupId, data);
      onOpenChange(false);
      toast({
        title: "Grupo actualizado",
        description: "El nombre del grupo ha sido actualizado exitosamente.",
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el grupo.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar grupo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nombre del grupo"
              {...register("name", { required: true })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
