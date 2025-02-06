"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Swords,
  Zap,
  MoreVertical,
  Trash2,
  Edit,
  ChevronRight,
  Clock,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { CreateMatchDialog } from "@/components/matches/create-match-dialog";
import { GroupWithDetails } from "@/types";
import { AddPlayerDialog } from "../players/add-player-dialog";
import { DeleteMatchAlert } from "../matches/delete-match-alert";
import {
  pluralize,
  getGroupAverageSkill,
  formatDate,
  getDaysAgo,
} from "@/lib/utils/format";
import { LevelBadge } from "../badges/level-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditMatchDialog } from "../matches/edit-match-dialog";
import { TeamCard } from "../matches/team-card";
import { EditGroupDialog } from "./edit-group-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { WinnerBadge, LoserBadge, MvpBadge } from "../badges";

function getPlayerStats(group: GroupWithDetails) {
  const stats = group.players.map((player) => {
    const matches =
      group.matches?.filter(
        (m) =>
          m.teamAPlayers.some((p) => p.id === player.id) ||
          m.teamBPlayers.some((p) => p.id === player.id)
      ).length ?? 0;

    const wins =
      group.matches?.filter((m) => {
        const isTeamA = m.teamAPlayers.some((p) => p.id === player.id);
        return (
          (isTeamA && m.winningTeam === "A") ||
          (!isTeamA && m.winningTeam === "B")
        );
      }).length ?? 0;

    const losses =
      group.matches?.filter((m) => {
        const isTeamA = m.teamAPlayers.some((p) => p.id === player.id);
        return (
          (isTeamA && m.winningTeam === "B") ||
          (!isTeamA && m.winningTeam === "A")
        );
      }).length ?? 0;

    const mvps =
      group.matches?.filter((m) => m.mvp?.id === player.id).length ?? 0;

    return { player, matches, mvps, wins, losses };
  });

  return {
    mostMatches: [...stats].sort((a, b) => b.matches - a.matches).slice(0, 3),
    mostMvps: [...stats].sort((a, b) => b.mvps - a.mvps).slice(0, 3),
    mostWins: [...stats].sort((a, b) => b.wins - a.wins).slice(0, 3),
    mostLosses: [...stats].sort((a, b) => b.losses - a.losses).slice(0, 3),
  };
}

export function GroupDetail({ group }: { group: GroupWithDetails }) {
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const [deleteMatchId, setDeleteMatchId] = useState<string | null>(null);
  const [editMatch, setEditMatch] = useState<
    GroupWithDetails["matches"][0] | null
  >(null);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 1280px)": { slidesToScroll: 3 },
    },
  });
  const [statsEmblaRef] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1280px)": { slidesToScroll: 3 },
    },
  });
  const stats = getPlayerStats(group);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditGroupOpen(true)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          {group.matches?.[0] && (
            <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {(() => {
                  const days = getDaysAgo(new Date(group.matches[0].date));
                  return `Último partido hace ${days} ${pluralize(
                    days,
                    "día",
                    "días"
                  )}`;
                })()}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">
                {group._count.players}{" "}
                {pluralize(group._count.players, "jugador", "jugadores")}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30">
              <Swords className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">
                {group._count.matches}{" "}
                {pluralize(group._count.matches, "partido", "partidos")}
              </span>
            </div>

            {getGroupAverageSkill(group.players) > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 shrink-0">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">
                  Nivel {getGroupAverageSkill(group.players).toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={() => setMatchDialogOpen(true)}
              className="flex-1"
            >
              <Swords className="h-4 w-4 mr-2" />
              Registrar partido
            </Button>
            <Button
              variant="outline"
              onClick={() => setPlayerDialogOpen(true)}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar jugadores
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-6">
            <Swords className="h-5 w-5 text-muted-foreground" />
            Últimos partidos
          </h2>
          {(group.matches?.length ?? 0) > 0 ? (
            <>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className={cn("flex gap-4 -ml-4")}>
                  {(group.matches ?? []).map((match) => (
                    <Card
                      key={match.id}
                      className={cn(
                        "shadow-sm transition-all",
                        "min-w-[85%] sm:min-w-[45%] xl:min-w-[30%] first:ml-4 snap-center"
                      )}
                    >
                      <div className="group relative overflow-hidden flex flex-col">
                        <div className="bg-muted/30 px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-2 border-b text-center">
                          <div className="flex items-center justify-center flex-1">
                            <span className="text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full text-sm">
                              {formatDate(new Date(match.date))}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4 p-4">
                          <TeamCard
                            team="A"
                            players={match.teamAPlayers}
                            winningTeam={match.winningTeam}
                            scoreDiff={match.scoreDiff}
                            mvp={match.mvp}
                          />
                          <TeamCard
                            team="B"
                            players={match.teamBPlayers}
                            winningTeam={match.winningTeam}
                            scoreDiff={match.scoreDiff}
                            mvp={match.mvp}
                          />
                        </div>
                        <div className="absolute right-2 top-2">
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-muted/50 flex items-center justify-center"
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
                    </Card>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm justify-center mt-4">
                <ChevronRight className="h-4 w-4 animate-bounceRight" />
                <span>Desliza para ver más</span>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">No hay partidos registrados</p>
          )}
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            Estadísticas
          </h2>
          {(group.matches?.length ?? 0) > 0 ? (
            <>
              <div className="overflow-hidden" ref={statsEmblaRef}>
                <div className={cn("flex gap-6")}>
                  <div>
                    <div className="min-w-[85vw] sm:min-w-[350px] lg:min-w-[400px]">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <Swords className="h-5 w-5 text-muted-foreground" />
                        Partidos jugados
                      </h3>
                      <div className="space-y-2">
                        {stats.mostMatches.map((stat, i) => (
                          <div
                            key={stat.player.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border bg-card relative",
                              i === 0 &&
                                "border-amber-500/30 bg-amber-50/30 shadow-sm",
                              i === 1 && "border-zinc-400/30 bg-zinc-50/30",
                              i === 2 && "border-orange-500/30 bg-orange-50/30"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg mr-2">
                                {i === 0 && "🥇"}
                                {i === 1 && "🥈"}
                                {i === 2 && "🥉"}
                              </span>
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                {stat.player.name[0].toUpperCase()}
                              </div>
                              <span className="font-medium">
                                {stat.player.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-muted-foreground",
                                  i === 0 && "text-amber-700 font-medium"
                                )}
                              >
                                {stat.matches}{" "}
                                {pluralize(stat.matches, "partido", "partidos")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="min-w-[85vw] sm:min-w-[350px] lg:min-w-[400px]">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <MvpBadge className="scale-90" />
                        MVPs
                      </h3>
                      <div className="space-y-2">
                        {stats.mostMvps.map((stat, i) => (
                          <div
                            key={stat.player.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border bg-card relative",
                              i === 0 &&
                                "border-amber-500/30 bg-amber-50/30 shadow-sm",
                              i === 1 && "border-zinc-400/30 bg-zinc-50/30",
                              i === 2 && "border-orange-500/30 bg-orange-50/30"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg mr-2">
                                {i === 0 && "🥇"}
                                {i === 1 && "🥈"}
                                {i === 2 && "🥉"}
                              </span>
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                {stat.player.name[0].toUpperCase()}
                              </div>
                              <span className="font-medium">
                                {stat.player.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-muted-foreground",
                                  i === 0 && "text-amber-700 font-medium"
                                )}
                              >
                                {stat.mvps}{" "}
                                {pluralize(stat.mvps, "MVP", "MVPs")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="min-w-[85vw] sm:min-w-[350px] lg:min-w-[400px]">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <WinnerBadge className="scale-90" />
                        Victorias
                      </h3>
                      <div className="space-y-2">
                        {stats.mostWins.map((stat, i) => (
                          <div
                            key={stat.player.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border bg-card relative",
                              i === 0 &&
                                "border-amber-500/30 bg-amber-50/30 shadow-sm",
                              i === 1 && "border-zinc-400/30 bg-zinc-50/30",
                              i === 2 && "border-orange-500/30 bg-orange-50/30"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg mr-2">
                                {i === 0 && "🥇"}
                                {i === 1 && "🥈"}
                                {i === 2 && "🥉"}
                              </span>
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                {stat.player.name[0].toUpperCase()}
                              </div>
                              <span className="font-medium">
                                {stat.player.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-muted-foreground",
                                  i === 0 && "text-amber-700 font-medium"
                                )}
                              >
                                {stat.wins}{" "}
                                {pluralize(stat.wins, "victoria", "victorias")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="min-w-[85vw] sm:min-w-[350px] lg:min-w-[400px]">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <LoserBadge className="scale-90" />
                        Derrotas
                      </h3>
                      <div className="space-y-2">
                        {stats.mostLosses.map((stat, i) => (
                          <div
                            key={stat.player.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border bg-card relative",
                              i === 0 &&
                                "border-amber-500/30 bg-amber-50/30 shadow-sm",
                              i === 1 && "border-zinc-400/30 bg-zinc-50/30",
                              i === 2 && "border-orange-500/30 bg-orange-50/30"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg mr-2">
                                {i === 0 && "🥇"}
                                {i === 1 && "🥈"}
                                {i === 2 && "🥉"}
                              </span>
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                {stat.player.name[0].toUpperCase()}
                              </div>
                              <span className="font-medium">
                                {stat.player.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-muted-foreground",
                                  i === 0 && "text-amber-700 font-medium"
                                )}
                              >
                                {stat.losses}{" "}
                                {pluralize(stat.losses, "derrota", "derrotas")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm justify-center mt-4">
                <ChevronRight className="h-4 w-4 animate-bounceRight" />
                <span>Desliza para ver más</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                No hay estadísticas disponibles
              </h3>
              <p className="text-muted-foreground text-sm max-w-[300px]">
                Registra algunos partidos para ver las estadísticas del grupo
              </p>
              <Button
                variant="outline"
                onClick={() => setMatchDialogOpen(true)}
                className="mt-6"
              >
                <Swords className="h-4 w-4 mr-2" />
                Registrar partido
              </Button>
            </div>
          )}
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Jugadores
          </h2>
          <div>
            {group.players.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {group.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-muted/50 transition-colors bg-card"
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
          </div>
        </div>
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
      <EditGroupDialog
        groupId={group.id}
        currentName={group.name}
        open={editGroupOpen}
        onOpenChange={setEditGroupOpen}
      />
    </div>
  );
}
