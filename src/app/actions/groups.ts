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

export async function getUserGroups() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      ownGroups: {
        include: {
          players: true,
          _count: {
            select: {
              players: true,
            },
          },
        },
      },
    },
  });

  // Obtener los matches en una consulta separada
  const groups = await Promise.all(
    (user?.ownGroups ?? []).map(async (group) => {
      const matchCount = await prisma.match.count({
        where: { groupId: group.id },
      });

      return {
        ...group,
        _count: {
          ...group._count,
          matches: matchCount,
        },
      };
    })
  );

  return groups;
}

export async function getGroupById(id: string) {
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

  const group = await prisma.group.findUnique({
    where: {
      id,
      ownerId: user.id,
    },
    include: {
      players: {
        orderBy: {
          skill: "desc",
        },
      },
      matches: {
        include: {
          teamAPlayers: true,
          teamBPlayers: true,
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  if (!group) return null;

  return {
    ...group,
    _count: {
      players: group.players.length,
      matches: group.matches.length,
    },
  };
}
