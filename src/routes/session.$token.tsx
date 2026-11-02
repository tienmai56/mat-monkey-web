import { createFileRoute } from "@tanstack/react-router";
import { InvitationPage } from "@/components/invitations/InvitationPage";

export const Route = createFileRoute("/session/$token")({
  head: () => ({
    meta: [
      { title: "You’re invited to train — Mat Mind" },
      { name: "description", content: "Open your Mat Mind training session invitation." },
      { name: "robots", content: "noindex, nofollow" },
      { name: "referrer", content: "no-referrer" },
    ],
  }),
  component: SessionInvitation,
});

function SessionInvitation() {
  const { token } = Route.useParams();
  return <InvitationPage kind="session" token={token} />;
}
