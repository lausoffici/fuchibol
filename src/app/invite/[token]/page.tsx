import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getGroupByInviteToken, joinGroup } from "@/app/actions/invitations";

interface InvitationPageProps {
  params: {
    token: string;
  };
}

export default async function InvitationPage({ params }: InvitationPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    const callbackUrl = `/invite/${params.token}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  try {
    const result = await getGroupByInviteToken(params.token);
    if (!result?.success || !result.group) {
      throw new Error("Invalid invitation token");
    }

    const joinResult = await joinGroup(result.group.id);
    if (!joinResult.success) {
      throw new Error("Failed to join group");
    }
  } catch {
    redirect("/");
  }

  redirect("/");
}
