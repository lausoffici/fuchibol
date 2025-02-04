import { Group, Player, Match } from "@prisma/client";

export type Params<T extends object = object> = Promise<T>;

export type PageProps<T extends object = object> = {
  params: Params<T>;
};

export type GroupWithDetails = Group & {
  players: Player[];
  matches: (Match & {
    teamAPlayers: Player[];
    teamBPlayers: Player[];
  })[];
  _count: {
    players: number;
    matches: number;
  };
};
