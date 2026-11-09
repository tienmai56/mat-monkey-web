import { createFileRoute } from "@tanstack/react-router";
import { LogoMark, Wordmark } from "@/components/home/brand";

const PAGE_URL = "https://mymatmonkey.com/privacy";
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
            Last updated: November 9, 2026
          </p>

          <div className="mt-10 space-y-10 rounded-[24px] bg-card p-6 text-[16px] leading-relaxed text-ink-secondary shadow-card sm:p-10">
            <Section title="1. What this policy covers">
              <p className="mb-4">
                This policy describes the Mat Monkey website, email signup records, web invitation
                previews and the app data practices described below. Mat Monkey’s social experience
                uses online services for accounts, training invitations and sharing; it is not an
                entirely local, account-free notebook.
              </p>
              <p>
                The social app uses a separate backend from this website’s email signup records. The
                details below distinguish information handled by this website from content managed
                inside the app. The website’s example profiles and training cards are fictional
                demonstrations, not live user records.
              </p>
            </Section>

            <Section title="2. Information handled by the website">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Email signup records:</strong> the signup database stores an email
                  address, the signup source where supplied, a record identifier and the creation
                  time. These records support beta invitations and update requests made through
                  earlier signup forms. The current homepage no longer has an email signup form;
                  removing it did not delete existing records.
                </li>
                <li>
                  <strong>Invitation requests:</strong> opening a friend, session or goal link sends
                  its invitation type and token to the app’s backend to check whether a preview is
                  available. This read-only check does not accept an invitation, change attendance
                  or create a record.
                </li>
                <li>
                  <strong>Session previews:</strong> an available session preview can include its
                  title, scheduled date and time, timezone, gym or venue, up to three participant
                  names with an additional participant count, and up to three training-focus names.
                  These details are used to display the invitation page and generate its share
                  image. Friend and goal web previews use generic branded wording rather than
                  displaying profile details or goal content.
                </li>
                <li>
                  <strong>Requests and support:</strong> hosting services receive the network
                  requests needed to deliver pages and images, including the requested URL and
                  technical request information. Server errors can be written to hosting logs. If
                  you email us, we receive your email address and the information you include.
                </li>
              </ul>
            </Section>

            <Section title="3. App content and your sharing choices">
              <ul className="mb-4 list-disc space-y-2 pl-6">
                <li>
                  <strong>Accounts and training:</strong> cloud records include profiles, training
                  sessions and attendance, shared goals, and private quick training logs. These
                  support your account, training plans, participation and saved training activity.
                </li>
                <li>
                  <strong>Social content:</strong> posts, photos, comments, likes, friend
                  connections and blocks support sharing and interactions with your training circle.
                  Uploaded media includes session photos, avatar files and goal media.
                </li>
                <li>
                  <strong>Notifications and operations:</strong> notifications and device push
                  tokens support delivery of app notifications. Reports and operational command
                  records support handling reports and app operations.
                </li>
              </ul>
              <p className="mb-4">
                Private local notebook content is distinct from these cloud features. Not every
                reflection or notebook entry is synchronized to the backend. Private quick training
                logs are cloud records, but are distinct from social posts and shared session
                content.
              </p>
              <p className="mb-4">
                The social experience includes account-based friend connections, session plans and
                attendance, training focus, completed-session photos or notes, shared goals and
                friendship streaks. You choose whom to invite and whether to share goals. Goals are
                personal until shared; shared goals follow their owner’s edits. Link-visible
                upcoming sessions can appear in friends’ Activity so they can join; friends-only
                sessions stay out of that feed.
              </p>
              <p className="mb-4">
                Web invitation links are accessible to someone who has the link, including a
                messaging service that fetches a preview. A session link can reveal the summary
                listed above without signing in to the website. Treat the link as access to that
                summary and share it only with people you intend to receive it. Full notes and
                nested training-focus details are not included in the web preview. Continuing to the
                invitation inside the app requires sign-in.
              </p>
              <p>
                Recipients can forward links, save images or take screenshots. Messaging services
                control their own preview caches. A revoked or unavailable invitation stops serving
                its session details on new website requests, but cannot remove copies already
                received or cached elsewhere.
              </p>
            </Section>

            <Section title="4. Optional contact matching">
              <p className="mb-4">
                If you choose contact matching, contact phone numbers are sent to the backend to
                find matches. Those uploaded numbers are processed but are not retained in the
                matching tables. This does not mean that only hashes leave your device.
              </p>
              <p>
                Your own verified phone number remains in the authentication service.
                Discoverability uses a keyed hash, and the matching process logs the match count and
                time. You can disable discoverability to control whether others can find you through
                this matching feature.
              </p>
            </Section>

            <Section title="5. Optional app usage analytics">
              <p className="mb-4">
                In app versions that support Settings → Share usage data, analytics is opt-in and
                initially off. The backend supports this consent-based system, but the updated
                native client still requires release. Not every currently available app version
                exposes this control.
              </p>
              <p className="mb-4">
                If you opt in, usage events cover app opens, navigation, sign-in attempts and
                outcomes, onboarding, and training-session and quick-log creation and outcomes.
                These events help understand app usage and where these flows succeed or encounter
                errors. They include random installation and session identifiers, account identity
                after sign-in, timestamps, app version and platform, screen or source, and
                controlled error codes. They do not copy freeform notes or authentication tokens.
              </p>
              <p className="mb-4">
                After sign-in, analytics can be linked to your account across devices and to
                activity recorded before sign-in. Opt-in analytics is therefore not necessarily
                anonymous.
              </p>
              <p>
                Raw events expire after 180 days. Minimal first-use timestamps remain until you
                withdraw consent or delete your account. Withdrawing consent clears local event
                queues and requests erasure from the server. If you withdraw while offline, that
                erasure request retries when the app reconnects.
              </p>
            </Section>

            <Section title="6. Services and recipients">
              <p className="mb-4">
                Lovable Cloud provides this website’s signup database, and Cloudflare Workers runs
                the invitation-page and image-generation code. The separate Mat Monkey app backend
                receives invitation checks and returns the permitted preview fields. Preview images
                are generated using bundled fonts and artwork rather than sending session details to
                an external image-generation service.
              </p>
              <p>
                People you share with and the messaging services they use can receive invitation
                summaries. The beta-download button takes you to Apple TestFlight; App Store links
                take you to Apple. Those services handle your interactions under their own policies.
                Contacting us by email also involves the email services used to deliver your
                message.
              </p>
            </Section>

            <Section title="7. Browser storage and tracking">
              <p className="mb-4">
                The current public homepage and privacy page do not include an advertising tracker,
                an analytics script or an email signup form. Fonts are served from this site. These
                pages do not provide a sign-in screen.
              </p>
              <p>
                The website’s authentication client is configured to retain a session in browser
                local storage when authentication is used. In an embedded Lovable editor preview,
                that session can also be synchronized with the editor; this is distinct from
                visiting the public site. You can clear site storage using your browser settings,
                but doing so does not delete server-side signup or app records. Hosting and linked
                services may handle technical request information separately from the website’s page
                code.
              </p>
            </Section>

            <Section title="8. Retention, deletion and access requests">
              <p className="mb-4">
                Existing email signup records remain in the website database. Its current
                implementation has no automatic expiry schedule or public self-service deletion or
                export screen. Removing the homepage form or clearing your browser does not erase
                those records.
              </p>
              <p className="mb-4">
                App account deletion removes uploaded session photos, avatar files, goal media,
                social account data and the authentication identity. This does not promise immediate
                erasure of backups or remove content that other people have saved. The analytics
                retention and consent-withdrawal rules are described above.
              </p>
              <p className="mb-4">
                To ask about information associated with you, request a copy or correction, or
                request deletion of a signup record or app information, contact the address below.
                Please identify the email address or account involved and what you are requesting;
                do not send your password or an invitation token. We may need additional information
                to identify the relevant record before acting on a request.
              </p>
              <p>
                The website does not provide an app-account deletion or export tool. This policy
                does not specify an app-wide deletion schedule, backup retention period or response
                deadline. Applicable privacy rights depend on your circumstances and location; you
                can use the same contact address to raise a privacy request or concern.
              </p>
            </Section>

            <Section title="9. Access controls and security">
              <p className="mb-4">
                The signup database restricts public access to validated submissions; it does not
                allow public reading, editing or deletion of the signup list. The invitation handler
                validates link tokens and limits the returned fields to the preview summary. Its
                lookup code does not log invitation tokens, backend response bodies or private
                invitation data.
              </p>
              <p>
                Invitation pages and their images request no browser caching, no search indexing and
                no referrer disclosure. These measures do not prevent recipients from keeping copies
                or guarantee that third-party services will discard their caches. No online service
                can eliminate every security risk; avoid including sensitive information in content
                that you intend to share.
              </p>
            </Section>

            <Section title="10. Updates and contact">
              <p>
                We may update this policy as Mat Monkey changes. The date above identifies the
                latest revision. Please check this page for updates and contact us with questions
                about how your information is handled.
              </p>
              <p className="mt-4">
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
