import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getGroupByInviteToken, joinGroup } from "@/app/actions/invitations";
import { PageProps } from "@/types/page";

export default async function InvitationPage({
  params,
}: PageProps<{ token: string }>) {
  const session = await getServerSession(authOptions);
  const { token } = await params;

  if (!session) {
    const callbackUrl = `/invite/${token}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const result = await getGroupByInviteToken(token);

  if (!result.success || !result.group) {
    redirect("/");
  }

  await joinGroup(result.group.id);

  redirect("/");
}
