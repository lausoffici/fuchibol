"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Swords,
  Zap,
  Trophy,
  Medal,
  Handshake,
  MoreVertical,
  Trash2,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CreateMatchDialog } from "@/components/matches/create-match-dialog";
import { GroupWithDetails } from "@/types";
import { AddPlayerDialog } from "../players/add-player-dialog";
import { DeleteMatchAlert } from "../matches/delete-match-alert";
import {
  pluralize,
  getGroupAverageSkill,
  formatDate,
  getTeamAverageSkill,
} from "@/lib/utils/format";
import { LevelBadge } from "../level-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditMatchDialog } from "../matches/edit-match-dialog";

export function GroupDetail({ group }: { group: GroupWithDetails }) {
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const [deleteMatchId, setDeleteMatchId] = useState<string | null>(null);
  const [editMatch, setEditMatch] = useState<
    GroupWithDetails["matches"][0] | null
  >(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {group._count.players}{" "}
                {pluralize(group._count.players, "jugador", "jugadores")}
              </span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Swords className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {group._count.matches}{" "}
                {pluralize(group._count.matches, "partido", "partidos")}
              </span>
            </div>
            {getGroupAverageSkill(group.players) > 0 && (
              <div className="flex items-center text-muted-foreground">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  Nivel {getGroupAverageSkill(group.players).toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Jugadores
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setPlayerDialogOpen(true)}
              className="h-9"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar jugadores
            </Button>
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
                    <LevelBadge level={player.skill} />
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Swords className="h-5 w-5 text-muted-foreground" />
              Últimos partidos
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setMatchDialogOpen(true)}
              className="h-9"
            >
              <Swords className="h-4 w-4 mr-2" />
              Registrar partido
            </Button>
          </CardHeader>
          <CardContent>
            {(group.matches?.length ?? 0) > 0 ? (
              <div className="space-y-4">
                {(group.matches ?? []).map((match) => (
                  <div
                    key={match.id}
                    className="rounded-lg border group relative overflow-hidden"
                  >
                    <div className="bg-muted/30 px-4 py-2 flex items-center justify-between border-b">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full text-sm">
                          {formatDate(new Date(match.date))}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-sm font-medium px-3 py-1 rounded-full",
                            match.winningTeam === null
                              ? "bg-slate-100 text-slate-700"
                              : "bg-blue-100 text-blue-700"
                          )}
                        >
                          {match.winningTeam === null
                            ? "Empate"
                            : `${match.scoreDiff ?? 0} ${pluralize(
                                match.scoreDiff ?? 0,
                                "gol",
                                "goles"
                              )} de diferencia`}
                        </span>
                        <span className="text-[12px] font-bold text-muted-foreground/70 border px-2 py-1 rounded-md">
                          {match.teamAPlayers.length}
                          <span className="mx-0.5 text-[9px] font-black text-muted-foreground/70 tracking-widest">
                            VS
                          </span>
                          {match.teamBPlayers.length}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-muted/50"
                            >
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditMatch(match)}
                              className="group flex items-center gap-2 text-sm font-medium hover:bg-muted/50 focus:bg-muted/50"
                            >
                              <Edit className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                              Editar partido
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteMatchId(match.id)}
                              className="group flex items-center gap-2 text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 text-destructive/70 group-hover:text-destructive transition-colors" />
                              Eliminar partido
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4">
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
                            {match.winningTeam === "A" && (
                              <Trophy className="h-4 w-4 text-amber-500" />
                            )}
                            {match.winningTeam === "B" && (
                              <Medal className="h-4 w-4 text-slate-400" />
                            )}
                            {match.winningTeam === null && (
                              <Handshake className="h-4 w-4 text-amber-600/70" />
                            )}
                          </h4>
                          <LevelBadge
                            level={getTeamAverageSkill(match.teamAPlayers)}
                            showDecimals
                          />
                        </div>
                        <div className="space-y-1">
                          {match.teamAPlayers.map((player) => (
                            <div
                              key={player.id}
                              className={cn(
                                "text-sm flex items-center gap-1.5",
                                match.mvp?.id === player.id && "font-medium"
                              )}
                            >
                              {player.name}
                              {match.mvp?.id === player.id && (
                                <span className="flex items-center gap-1">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">
                                    MVP
                                  </span>
                                  🔥
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
                            Equipo B{" "}
                            {match.winningTeam === "B" && (
                              <Trophy className="h-4 w-4 text-amber-500" />
                            )}
                            {match.winningTeam === "A" && (
                              <Medal className="h-4 w-4 text-slate-400" />
                            )}
                            {match.winningTeam === null && (
                              <Handshake className="h-4 w-4 text-amber-600/70" />
                            )}
                          </h4>
                          <LevelBadge
                            level={getTeamAverageSkill(match.teamBPlayers)}
                            showDecimals
                          />
                        </div>
                        <div className="space-y-1">
                          {match.teamBPlayers.map((player) => (
                            <div
                              key={player.id}
                              className={cn(
                                "text-sm flex items-center gap-1.5",
                                match.mvp?.id === player.id && "font-medium"
                              )}
                            >
                              {player.name}
                              {match.mvp?.id === player.id && (
                                <span className="flex items-center gap-1">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">
                                    MVP
                                  </span>
                                  🔥
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
      <DeleteMatchAlert
        matchId={deleteMatchId!}
        groupId={group.id}
        open={deleteMatchId !== null}
        onOpenChange={(open) => !open && setDeleteMatchId(null)}
      />
      <EditMatchDialog
        match={editMatch!}
        players={group.players}
        open={editMatch !== null}
        onOpenChange={(open) => !open && setEditMatch(null)}
      />
    </div>
  );
}
