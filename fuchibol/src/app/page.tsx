import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-4">
      <header className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fuchibol</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.user?.name}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="font-semibold mb-2">Últimos partidos</h2>
            <p className="text-sm text-muted-foreground">
              No hay partidos registrados
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="font-semibold mb-2">Estadísticas</h2>
            <p className="text-sm text-muted-foreground">
              No hay estadísticas disponibles
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="font-semibold mb-2">Ranking</h2>
            <p className="text-sm text-muted-foreground">
              No hay jugadores en el ranking
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
