"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, UserPlus } from "lucide-react";
import { createInvitation } from "@/app/actions/invitations";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface InviteButtonProps {
  groupId: string;
}

export function InviteButton({ groupId }: InviteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  async function generateInviteLink() {
    try {
      setIsLoading(true);
      const result = await createInvitation(groupId);

      if (!result.success) {
        throw new Error(result.error);
      }

      const link = `${window.location.origin}/invite/${result.invitation?.token}`;
      setInviteLink(link);

      try {
        await navigator.clipboard.writeText(link);
        toast.success("Invitation link copied to clipboard!");
      } catch (clipboardError) {
        // Silently fail if clipboard is not available
        console.warn("Clipboard API not available:", clipboardError);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate invitation link");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyToClipboard() {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invitation link copied to clipboard!");
    } catch (error) {
      console.warn("Clipboard API not available:", error);
      toast.error(
        "Could not copy to clipboard. Please select and copy the link manually."
      );
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
        <div className="flex flex-col gap-4">
          {inviteLink ? (
            <div className="flex flex-col gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="w-full font-mono text-sm"
              />
              <Button
                type="button"
                onClick={copyToClipboard}
                className="w-full"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar enlace
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={generateInviteLink}
              disabled={isLoading}
              className="w-full"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Generar enlace de invitación
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
