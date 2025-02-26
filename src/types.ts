import { Group, Player, Match, User } from "@prisma/client";

export type Params<T extends object = object> = Promise<T>;

export type PageProps<T extends object = object> = {
  params: T;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type GroupWithDetails = Group & {
  players: Player[];
  matches: (Match & {
    teamAPlayers: Player[];
    teamBPlayers: Player[];
    mvp: Player | null;
  })[];
  _count: {
    players: number;
    matches: number;
  };
  owner: User;
};
