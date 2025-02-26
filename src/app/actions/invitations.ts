"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function createInvitation(groupId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    // Check if user owns the group
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        owner: {
          email: session.user.email,
        },
      },
    });

    if (!group) {
      throw new Error("Group not found or unauthorized");
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        token: nanoid(32),
        groupId,
      },
    });

    revalidatePath(`/groups/${groupId}`);
    return { success: true, invitation };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create invitation",
    };
  }
}

export async function getGroupByInviteToken(token: string) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        group: {
          include: {
            owner: true,
            _count: {
              select: {
                players: true,
                matches: true,
              },
            },
            matches: {
              orderBy: {
                date: "desc",
              },
              include: {
                teamAPlayers: true,
                teamBPlayers: true,
                mvp: true,
              },
            },
            players: {
              orderBy: {
                name: "asc",
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    return { success: true, group: invitation.group };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get group",
    };
  }
}

export async function joinGroup(groupId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.group.update({
      where: { id: groupId },
      data: {
        members: {
          connect: { id: user.id },
        },
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to join group",
    };
  }
}
