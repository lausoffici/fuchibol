import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El partido será eliminado
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleDelete}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
