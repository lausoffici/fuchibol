"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";

interface CreateGroupInput {
  name: string;
  players: {
    name: string;
    skill: number;
  }[];
}

export async function createGroup(input: CreateGroupInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const group = await prisma.group.create({
    data: {
      name: input.name,
      ownerId: user.id,
      members: {
        connect: { id: user.id },
      },
      players: {
        create: input.players.map((player) => ({
          name: player.name,
          skill: player.skill,
        })),
      },
    },
  });

  revalidatePath("/");
  return group;
}
