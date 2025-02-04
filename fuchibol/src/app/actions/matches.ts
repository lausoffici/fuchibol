"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";

interface CreateMatchInput {
  groupId: string;
  teamA: string[];
  teamB: string[];
  winner: "A" | "B" | "DRAW";
  scoreDiff?: number;
}

export async function createMatch(input: CreateMatchInput) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }

  const match = await prisma.match.create({
    data: {
      groupId: input.groupId,
      teamAPlayers: {
        connect: input.teamA.map((id) => ({ id })),
      },
      teamBPlayers: {
        connect: input.teamB.map((id) => ({ id })),
      },
      winningTeam: input.winner === "DRAW" ? null : input.winner,
      scoreDiff: input.winner === "DRAW" ? null : input.scoreDiff,
    },
  });

  revalidatePath(`/groups/${input.groupId}`);
  return match;
}
