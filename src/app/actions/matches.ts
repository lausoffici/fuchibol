"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";
import { Match, Prisma } from "@prisma/client";

interface CreateMatchInput {
  groupId: string;
  teamA: string[];
  teamB: string[];
  winner: "A" | "B" | "DRAW";
  scoreDiff?: number;
  teamAScore?: number;
  teamBScore?: number;
  mvpId?: string;
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
      connect: input.teamA.map((id) => ({ id })),
    },
    teamBPlayers: {
      connect: input.teamB.map((id) => ({ id })),
    },
    winningTeam: input.winner === "DRAW" ? null : input.winner,
    scoreDiff: input.scoreDiff,
    teamAScore: input.teamAScore,
    teamBScore: input.teamBScore,
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
