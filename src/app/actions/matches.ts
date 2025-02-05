"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";
import { Match, Prisma } from "@prisma/client";

interface CreateMatchInput {
  groupId: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  winningTeam: string | null;
  mvpId?: string;
  scoreDiff?: number;
}

export async function createMatch(input: CreateMatchInput): Promise<Match> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }

  const createData: Prisma.MatchCreateInput = {
    group: {
      connect: { id: input.groupId },
    },
    teamAPlayers: {
      connect: input.teamAPlayers.map((id) => ({ id })),
    },
    teamBPlayers: {
      connect: input.teamBPlayers.map((id) => ({ id })),
    },
    winningTeam: input.winningTeam,
    scoreDiff: input.scoreDiff,
  };

  if (input.mvpId) {
    createData.mvp = {
      connect: { id: input.mvpId },
    };
  }

  const match = await prisma.match.create({
    data: createData,
    include: {
      mvp: true,
      teamAPlayers: true,
      teamBPlayers: true,
    },
  });

  revalidatePath(`/groups/${input.groupId}`);
  return match;
}

export async function deleteMatch(matchId: string, groupId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }

  await prisma.match.delete({
    where: { id: matchId },
  });

  revalidatePath(`/groups/${groupId}`);
}

interface UpdateMatchInput {
  matchId: string;
  groupId: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  winningTeam: string | null;
  mvpId?: string;
  scoreDiff?: number;
}

export async function updateMatch(input: UpdateMatchInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }

  const updateData: Prisma.MatchUpdateInput = {
    teamAPlayers: {
      set: input.teamAPlayers.map((id) => ({ id })),
    },
    teamBPlayers: {
      set: input.teamBPlayers.map((id) => ({ id })),
    },
    winningTeam: input.winningTeam,
    scoreDiff: input.scoreDiff,
    mvp: input.mvpId
      ? {
          connect: { id: input.mvpId },
        }
      : {
          disconnect: true,
        },
  };

  const match = await prisma.match.update({
    where: { id: input.matchId },
    data: updateData,
    include: {
      mvp: true,
      teamAPlayers: true,
      teamBPlayers: true,
    },
  });

  revalidatePath(`/groups/${input.groupId}`);
  return match;
}
