import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useState } from "react";
import { deleteMatch } from "@/app/actions/matches";
import { useToast } from "@/hooks/use-toast";

interface DeleteMatchAlertProps {
  matchId: string;
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteMatchAlert({
  matchId,
  groupId,
  open,
  onOpenChange,
}: DeleteMatchAlertProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteMatch(matchId, groupId);
      toast({
        title: "Partido eliminado",
        description: "El partido se ha eliminado correctamente",
      });
      onOpenChange(false);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo eliminar el partido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Estás seguro?"
      className="sm:max-w-[425px]"
    >
      <div className="py-2 sm:py-4">
        <p className="text-sm text-muted-foreground sm:text-center">
          Esta acción no se puede deshacer. El partido será eliminado
          permanentemente.
        </p>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="sm:w-auto w-full"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="sm:w-auto w-full"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
