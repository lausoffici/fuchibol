"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChevronRight, Trophy } from "lucide-react";
import { CreateGroupButton } from "./create-group-button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Player {
  id: string;
  name: string;
  skill: number;
}

interface Group {
  id: string;
  name: string;
  players: Player[];
  _count: {
    players: number;
    matches: number;
  };
}

function getSkillColor(skill: number) {
  if (skill >= 7) return "bg-emerald-500/20 text-emerald-700";
  if (skill >= 4) return "bg-amber-500/20 text-amber-700";
  return "bg-red-500/20 text-red-700";
}

export function GroupsList({ groups }: { groups: Group[] }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tus grupos</h2>
        <CreateGroupButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Link href={`/groups/${group.id}`} key={group.id}>
            <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {group.name}
                    </CardTitle>
                    <div className="flex items-center mt-2 text-muted-foreground gap-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {group._count.players} jugadores
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {group._count.matches} partidos
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Jugadores</div>
                    {group.players.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {group.players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between rounded-lg border px-3 py-2"
                          >
                            <span className="text-sm font-medium">
                              {player.name}
                            </span>
                            <span
                              className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-full",
                                getSkillColor(player.skill)
                              )}
                            >
                              {player.skill}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No hay jugadores en este grupo
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
