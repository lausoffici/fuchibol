import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { NoGroups } from "@/components/empty-states/no-groups";
import { GroupsList } from "@/components/groups/groups-list";
import { getUserGroups } from "./actions/groups";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const groups = await getUserGroups();
  const hasGroups = groups.length > 0;

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
        {hasGroups ? <GroupsList groups={groups} /> : <NoGroups />}
      </main>
    </div>
  );
}
