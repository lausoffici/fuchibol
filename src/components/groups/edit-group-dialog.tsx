"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EditGroupFormValues>();

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
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar nombre del grupo"
      className="sm:max-w-[425px]"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 py-2 sm:py-4"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nombre del grupo"
              {...register("name", { required: true })}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="sm:w-auto w-full"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="sm:w-auto w-full"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
