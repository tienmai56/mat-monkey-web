import { createFileRoute } from "@tanstack/react-router";
import { LogoMark, Wordmark } from "@/components/home/brand";

const PAGE_URL = "https://matmonkey.lovable.app/privacy";
const TITLE = "Privacy Policy — Mat Monkey";
const DESCRIPTION = "Read how Mat Monkey handles information and privacy.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: Privacy,
});

function BrandLink({ size }: { size: number }) {
  return (
    <a href="/" className="flex items-center gap-2.5" aria-label="mat monkey home">
      <LogoMark size={size} />
      <Wordmark className={size > 30 ? "text-[22px] text-ink" : "text-[20px] text-ink"} />
    </a>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-paper-3/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
        <BrandLink size={32} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-paper-3">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <BrandLink size={28} />
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-semibold text-ink-secondary"
        >
          <a href="/privacy" className="py-2 hover:text-ink" aria-current="page">
            Privacy
          </a>
          <a href="/" className="py-2 hover:text-ink">
            Home
          </a>
          <span className="py-2">© {new Date().getFullYear()} Mat Monkey</span>
        </nav>
      </div>
    </footer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-[22px] leading-tight tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Privacy() {
  return (
    <div className="min-h-screen bg-paper-2 font-sans text-foreground">
      <Nav />
      <main>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20">
          <h1 className="font-display text-[36px] leading-none tracking-[-0.03em] text-ink md:text-[48px]">
            Privacy Policy for Mat Monkey
          </h1>
          <p className="mt-3 text-[15px] font-semibold text-ink-tertiary">
            Effective Date: July 8, 2026
          </p>

          <div className="mt-10 space-y-10 rounded-[24px] bg-card p-6 text-[16px] leading-relaxed text-ink-secondary shadow-card sm:p-10">
            <Section title="1. No Data Collection">
              <p className="mb-4">
                We do not collect, store, or process any personal information from our users.
              </p>
              <p className="mb-4">
                Mat Monkey is designed to function entirely locally on your device. We do not:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Require user accounts or registration.</li>
                <li>Collect your name, email, or contact details.</li>
                <li>Track your usage habits, training progress, or location.</li>
                <li>Use cookies or third-party tracking services to monitor your activity.</li>
              </ul>
            </Section>

            <Section title="2. Third-Party Services">
              <p>
                Because our application does not collect user data, we do not share, sell, or
                disclose any information to third parties.
              </p>
            </Section>

            <Section title="3. Changes to This Privacy Policy">
              <p>
                We may update this policy occasionally. Since we do not collect user information, we
                will not have a way to notify you of changes via email. We encourage you to check
                this page periodically for updates.
              </p>
            </Section>

            <Section title="4. Contact Us">
              <p className="mb-4">
                If you have any questions about this privacy-first approach, please reach out to us
                at:
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:mptienmai98@gmail.com"
                  className="font-semibold text-coral-text underline-offset-4 hover:underline"
                >
                  mptienmai98@gmail.com
                </a>
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
