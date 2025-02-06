export interface PlayerStat {
  player: {
    id: string;
    name: string;
  };
  matches: number;
  mvps: number;
  wins: number;
  losses: number;
}

export interface PlayerStats {
  mostMatches: PlayerStat[];
  mostMvps: PlayerStat[];
  mostWins: PlayerStat[];
  mostLosses: PlayerStat[];
}
