"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Settings2, Trophy, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CreateMatchDialog } from "@/components/matches/create-match-dialog";
import { GroupWithDetails } from "@/types";
import { AddPlayerDialog } from "../players/add-player-dialog";

function getSkillColor(skill: number) {
  if (skill >= 7) return "bg-emerald-500/20 text-emerald-700";
  if (skill >= 4) return "bg-amber-500/20 text-amber-700";
  return "bg-red-500/20 text-red-700";
}

// Función helper para formatear la fecha
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    weekday: "long",
    year: "numeric",
  })
    .format(date)
    .replace(".", "")
    .toLowerCase();
}

export function GroupDetail({ group }: { group: GroupWithDetails }) {
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const averageSkill =
    group.players.reduce((sum, player) => sum + player.skill, 0) /
    group.players.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <div className="flex items-center mt-2 gap-6">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-1.5" />
              <span>{group._count.players} jugadores</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Trophy className="h-4 w-4 mr-1.5" />
              <span>{group._count.matches} partidos</span>
            </div>
            {averageSkill && (
              <div className="flex items-center text-muted-foreground">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  Nivel promedio: {averageSkill.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPlayerDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar jugador
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMatchDialogOpen(true)}
          >
            <Swords className="h-4 w-4 mr-1" />
            Registrar partido
          </Button>
          <Button variant="outline" size="sm">
            <Settings2 className="h-4 w-4 mr-1" />
            Configuración
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Jugadores</CardTitle>
          </CardHeader>
          <CardContent>
            {group.players.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {group.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        {player.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{player.name}</span>
                    </div>
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
              <p className="text-muted-foreground">
                No hay jugadores en este grupo
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Últimos partidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(group.matches?.length ?? 0) > 0 ? (
              <div className="space-y-4">
                {(group.matches ?? []).map((match) => (
                  <div
                    key={match.id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full text-xs">
                        {formatDate(new Date(match.date))}
                      </span>
                      <span className="font-medium">
                        {match.teamAScore !== null && match.teamBScore !== null
                          ? `${match.teamAScore} - ${match.teamBScore}`
                          : match.winningTeam === null
                          ? "Empate"
                          : `${match.scoreDiff} ${
                              match.scoreDiff === 1 ? "gol" : "goles"
                            } de diferencia`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={cn(
                          "space-y-2 p-3 rounded-lg",
                          match.winningTeam === "A"
                            ? "bg-emerald-100 border-2 border-emerald-300 shadow-sm"
                            : match.winningTeam === null
                            ? "bg-amber-50 border-2 border-amber-200"
                            : "bg-muted/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium flex items-center gap-2">
                            Equipo A{" "}
                            <span className="text-xs text-muted-foreground">
                              ({match.teamAPlayers.length})
                            </span>
                            {match.winningTeam === "A" && "🏆"}
                          </h4>
                          <span className="text-sm bg-muted/30 px-2 py-0.5 rounded-full">
                            Nivel:{" "}
                            {(
                              match.teamAPlayers.reduce(
                                (sum, p) => sum + p.skill,
                                0
                              ) / match.teamAPlayers.length
                            ).toFixed(1)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {match.teamAPlayers.map((player) => (
                            <div
                              key={player.id}
                              className={cn(
                                "text-sm flex items-center gap-1.5",
                                match.mvp?.id === player.id &&
                                  "font-medium text-amber-600"
                              )}
                            >
                              {player.name}
                              {match.mvp?.id === player.id && (
                                <span className="flex items-center gap-1 text-amber-400">
                                  <span className="text-[10px] uppercase font-bold tracking-wider">
                                    MVP
                                  </span>
                                  👑
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "space-y-2 p-3 rounded-lg",
                          match.winningTeam === "B"
                            ? "bg-emerald-100 border-2 border-emerald-300 shadow-sm"
                            : match.winningTeam === null
                            ? "bg-amber-50 border-2 border-amber-200"
                            : "bg-muted/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium flex items-center gap-2">
                            Equipo B {match.winningTeam === "B" && "🏆"}
                            {match.winningTeam === null && "🤝"}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            Nivel:{" "}
                            {(
                              match.teamBPlayers.reduce(
                                (sum, p) => sum + p.skill,
                                0
                              ) / match.teamBPlayers.length
                            ).toFixed(1)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {match.teamBPlayers.map((player) => (
                            <div
                              key={player.id}
                              className={cn(
                                "text-sm flex items-center gap-1.5",
                                match.mvp?.id === player.id &&
                                  "font-medium text-amber-600"
                              )}
                            >
                              {player.name}
                              {match.mvp?.id === player.id && (
                                <span className="flex items-center gap-1 text-amber-400">
                                  <span className="text-[10px] uppercase font-bold tracking-wider">
                                    MVP
                                  </span>
                                  👑
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No hay partidos registrados
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <AddPlayerDialog
        groupId={group.id}
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
      />
      <CreateMatchDialog
        groupId={group.id}
        players={group.players}
        open={matchDialogOpen}
        onOpenChange={setMatchDialogOpen}
      />
    </div>
  );
}
