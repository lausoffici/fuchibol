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

export async function getGroup(id: string) {
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      players: true,
      matches: {
        include: {
          teamAPlayers: true,
          teamBPlayers: true,
          mvp: true,
        },
        orderBy: {
          date: "desc",
        },
      },
      _count: {
        select: {
          players: true,
          matches: true,
        },
      },
    },
  });

  return group;
}

interface AddPlayerInput {
  groupId: string;
  name: string;
  skill: number;
}

export async function addPlayerToGroup(input: AddPlayerInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }

  const player = await prisma.player.create({
    data: {
      name: input.name,
      skill: input.skill,
      groupId: input.groupId,
    },
  });

  revalidatePath(`/groups/${input.groupId}`);
  return player;
}

export async function updateGroup(id: string, data: { name: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No autorizado");
  }

  const group = await prisma.group.update({
    where: { id },
    data: { name: data.name },
  });

  revalidatePath(`/groups/${id}`);
  return group;
}
