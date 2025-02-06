"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function GroupDetail({ group }: { group: GroupWithDetails }) {
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const [deleteMatchId, setDeleteMatchId] = useState<string | null>(null);
  const [editMatch, setEditMatch] = useState<
    GroupWithDetails["matches"][0] | null
  >(null);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
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
        <div className="flex gap-2">
          <Button
            variant="outline"
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
            <div className="space-y-4">
              {(group.matches ?? []).map((match) => (
                <Card key={match.id} className="shadow-none">
                  <div className="rounded-lg border group relative overflow-hidden flex flex-col">
                    <div className="bg-muted/30 px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-2 border-b text-center">
                      <div className="flex items-center justify-center flex-1">
                        <span className="text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full text-sm">
                          {formatDate(new Date(match.date))}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 p-4">
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
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No hay partidos registrados</p>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Jugadores
            </CardTitle>
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
