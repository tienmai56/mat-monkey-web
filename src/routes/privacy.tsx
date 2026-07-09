import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/mat-mind-logo.png";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Mat Mind" },
      {
        name: "description",
        content:
          "Mat Mind does not collect, store, or process personal information. Read our privacy-first policy.",
      },
      { property: "og:title", content: "Privacy Policy — Mat Mind" },
      {
        property: "og:description",
        content:
          "Mat Mind does not collect, store, or process personal information.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

function Wordmark() {
  return (
    <a href="/" className="flex items-center gap-2 group">
      <img
        src={logo}
        alt="Mat Mind logo"
        width={32}
        height={32}
        className="h-8 w-8 rounded-lg"
      />
      <span className="font-heading font-extrabold tracking-tight text-base">
        Mat Mind
      </span>
    </a>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
        <Wordmark />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <Wordmark />
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <span>Train with purpose.</span>
        </div>
        <span>© {new Date().getFullYear()} Mat Mind</span>
      </div>
    </footer>
  );
}

function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
            <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Privacy Policy for MatMind BJJ
            </h1>
            <p className="mt-2 text-muted-foreground">
              Effective Date: July 8, 2026
            </p>

            <div className="mt-10 space-y-10 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  1. No Data Collection
                </h2>
                <p className="mb-4">
                  We do not collect, store, or process any personal information from our users.
                </p>
                <p className="mb-4">
                  MatMind BJJ is designed to function entirely locally on your device. We do not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Require user accounts or registration.</li>
                  <li>Collect your name, email, or contact details.</li>
                  <li>Track your usage habits, training progress, or location.</li>
                  <li>Use cookies or third-party tracking services to monitor your activity.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  2. Third-Party Services
                </h2>
                <p className="mb-4">
                  Because our application does not collect user data, we do not share, sell, or disclose any information to third parties.
                </p>
                <p>
                  Note: If your application relies on external infrastructure (e.g., if your app is hosted on a platform that logs basic server access, or if you use specific APIs that collect data), you may still need to disclose that. If you are certain no data is being collected by the platform hosting your app, the statement above holds true.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  3. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this policy occasionally. Since we do not collect user information, we will not have a way to notify you of changes via email. We encourage you to check this page periodically for updates.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                  4. Contact Us
                </h2>
                <p className="mb-4">
                  If you have any questions about this privacy-first approach, please reach out to us at:
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:mptienmai98@gmail.com"
                    className="text-primary hover:underline"
                  >
                    mptienmai98@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
