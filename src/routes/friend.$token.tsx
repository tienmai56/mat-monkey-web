import { createFileRoute } from "@tanstack/react-router";
import { InvitationPage } from "@/components/invitations/InvitationPage";

export const Route = createFileRoute("/friend/$token")({
  head: () => ({
    meta: [
      { title: "Train together — Mat Mind" },
      { name: "description", content: "Open your training partner’s Mat Mind invitation." },
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: FriendInvitation,
});

function FriendInvitation() {
  const { token } = Route.useParams();
  return <InvitationPage kind="friend" token={token} />;
}
