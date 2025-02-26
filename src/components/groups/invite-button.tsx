"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, UserPlus } from "lucide-react";
import { createInvitation } from "@/app/actions/invitations";
import { toast } from "sonner";

interface InviteButtonProps {
  groupId: string;
}

export function InviteButton({ groupId }: InviteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function copyInviteLink() {
    try {
      setIsLoading(true);
      const result = await createInvitation(groupId);

      if (!result.success) {
        throw new Error(result.error);
      }

      const inviteLink = `${window.location.origin}/invite/${result.invitation?.token}`;
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invitation link copied to clipboard!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate invitation link");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Invitar amigos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar amigos</DialogTitle>
          <DialogDescription>
            Comparte este enlace con tus amigos para que puedan unirse al grupo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            onClick={copyInviteLink}
            disabled={isLoading}
            className="w-full"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar enlace de invitación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
