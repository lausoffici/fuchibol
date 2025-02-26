"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChevronRight, Trophy, Zap } from "lucide-react";
import { CreateGroupButton } from "./create-group-button";
import { pluralize, getGroupAverageSkill } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Player {
  id: string;
  name: string;
  skill: number;
}

interface Group {
  id: string;
  name: string;
  players: Player[];
  owner: {
    email: string;
    name: string;
  };
  _count: {
    players: number;
    matches: number;
  };
}

export function GroupsList({ groups }: { groups: Group[] }) {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tus grupos</h2>
        <CreateGroupButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const isOwner = session?.user?.email === group.owner.email;

          return (
            <Link href={`/groups/${group.id}`} key={group.id}>
              <Card className="transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:bg-accent/40 cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold text-foreground/90 group-hover:text-primary transition-colors duration-200">
                          {group.name}
                        </CardTitle>
                        {!isOwner && (
                          <Badge variant="secondary" className="text-xs">
                            Invitado
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center mt-2 text-muted-foreground gap-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {group._count.players}{" "}
                            {pluralize(
                              group._count.players,
                              "jugador",
                              "jugadores"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {group._count.matches}{" "}
                            {pluralize(
                              group._count.matches,
                              "partido",
                              "partidos"
                            )}
                          </span>
                        </div>
                        {getGroupAverageSkill(group.players) > 0 && (
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              Nivel{" "}
                              {getGroupAverageSkill(group.players).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        <span>Creado por {group.owner.name}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
