export const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? singular : plural;
};

export const getSkillColor = (skill: number) => {
  if (skill >= 7) return "bg-emerald-500/20 text-emerald-700";
  if (skill >= 4) return "bg-amber-500/20 text-amber-700";
  return "bg-red-500/20 text-red-700";
};

export const getGroupAverageSkill = (players: { skill: number }[]) => {
  if (players.length === 0) return 0;
  return players.reduce((sum, p) => sum + (p.skill ?? 0), 0) / players.length;
};

export const getTeamAverageSkill = (players: { skill: number }[]) => {
  if (players.length === 0) return 0;
  return players.reduce((sum, p) => sum + (p.skill ?? 0), 0) / players.length;
};

export function formatDate(date: Date) {
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
