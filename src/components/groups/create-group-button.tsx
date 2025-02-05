"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateGroupDialog } from "./create-group-dialog";

export function CreateGroupButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Nuevo grupo
      </Button>
      <CreateGroupDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
