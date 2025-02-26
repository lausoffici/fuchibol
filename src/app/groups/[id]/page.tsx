import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { getGroup } from "@/app/actions/groups";
import { GroupDetail } from "@/components/groups/group-detail";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageProps } from "@/types/page";

type GroupPageParams = {
  id: string;
};

export default async function GroupPage({
  params,
}: PageProps<GroupPageParams>) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    redirect("/login");
  }

  const group = await getGroup(id);

  if (!group) {
    redirect("/");
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver
            </Link>
          </Button>
        </div>

        <GroupDetail group={group} />
      </div>
    </div>
  );
}
