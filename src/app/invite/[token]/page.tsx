import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getGroupByInviteToken, joinGroup } from "@/app/actions/invitations";
import { PageProps } from "@/types";

export default async function InvitationPage({
  params,
}: PageProps<{ token: string }>) {
  const session = await getServerSession(authOptions);
  const { token } = params;

  if (!session) {
    const callbackUrl = `/invite/${token}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const group = await getGroupByInviteToken(token);

  if (!group) {
    redirect("/");
  }

  await joinGroup(token);

  redirect("/");
}
