"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";

export function NoGroups() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <PlusCircle className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No hay grupos creados</h2>
        <p className="mb-8 mt-2 text-center text-sm text-muted-foreground">
          Crea tu primer grupo de jugadores para comenzar a registrar partidos y
          estadísticas.
        </p>
        <Button onClick={() => setOpen(true)} size="lg">
          Crear grupo
        </Button>
      </div>

      <CreateGroupDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
