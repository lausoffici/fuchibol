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

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="space-y-4">
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
          <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-3 rounded-lg">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium text-foreground">
                {group._count.players}{" "}
                {pluralize(group._count.players, "jugador", "jugadores")}
              </span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Swords className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium text-foreground">
                {group._count.matches}{" "}
                {pluralize(group._count.matches, "partido", "partidos")}
              </span>
            </div>
            {getGroupAverageSkill(group.players) > 0 && (
              <div className="flex items-center text-muted-foreground">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium text-foreground">
                  Nivel {getGroupAverageSkill(group.players).toFixed(1)}
                </span>
              </div>
            )}
          </div>
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

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Swords className="h-5 w-5 text-muted-foreground" />
            Últimos partidos
          </h2>
          {(group.matches?.length ?? 0) > 0 ? (
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
                        <DropdownMenu>
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
          ) : (
            <p className="text-muted-foreground">No hay partidos registrados</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-muted-foreground" />
            Jugadores
          </h2>
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
