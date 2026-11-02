import { APP_STORE_URL, invitationAppURL, type InvitationKind } from "@/lib/app-links";
import logo from "@/assets/mat-mind-logo.png";

export function InvitationPage({ kind, token }: { kind: InvitationKind; token: string }) {
  const appURL = invitationAppURL(kind, token);
  const title = !appURL
    ? "This invitation is incomplete"
    : kind === "friend"
      ? "Your next training partner is here"
      : "Make time for the mat";

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="mx-auto w-full max-w-5xl px-6 py-6">
        <a href="/" className="inline-flex items-center gap-2 font-heading font-extrabold">
          <img src={logo} alt="" width={36} height={36} className="rounded-lg" />
          Mat Mind
        </a>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <section className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
          <p className="mb-4 text-sm font-bold text-primary">
            {kind === "friend" ? "Train together" : "You’re invited"}
          </p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {!appURL
              ? "Ask your training partner to share the full link again."
              : kind === "friend"
                ? "Open Mat Mind and sign in to connect with your training partner."
                : "Open Mat Mind and sign in to view the session and respond to the invitation."}
          </p>
          <div className="mt-8 space-y-3">
            {appURL && (
              <a
                href={appURL}
                className="flex min-h-12 items-center justify-center rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Open invitation in Mat Mind
              </a>
            )}
            <a
              href={APP_STORE_URL}
              rel="noreferrer"
              className="flex min-h-12 items-center justify-center rounded-full border border-border px-5 py-3 font-bold transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Get Mat Mind on the App Store
            </a>
          </div>
          {appURL && (
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Installing for the first time? Return to this original invitation after installing,
              then open it again. Mat Mind will check whether it is still available.
            </p>
          )}
        </section>
      </main>
      <footer className="px-6 pb-8 text-center text-sm text-muted-foreground">
        <a href="/" className="underline underline-offset-4">
          About Mat Mind
        </a>
      </footer>
    </div>
  );
}
