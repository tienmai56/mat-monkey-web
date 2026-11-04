import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  CircleCheck,
  Flame,
  Menu,
  NotebookPen,
  Plus,
  QrCode,
  Share2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AppStoreButton,
  Avatar,
  AvatarStack,
  LogoMark,
  StreakBelt,
  TapeLabel,
  TiedAvatars,
  Wordmark,
  type WeekState,
} from "@/components/home/brand";
import { PhoneFrame, SessionTicket, TrainingScreen } from "@/components/home/phone";
import photoGrapple from "@/assets/photos/grapple-match.jpg.asset.json";

const SITE = "https://matmindbjj.lovable.app";
const TITLE = "Mat Monkey — More mat time. Better company.";
const DESCRIPTION =
  "Mat Monkey is the friendship-first BJJ app. Plan sessions with your training partners, set a focus, remember the rounds with a photo or a note, share goals and keep weekly friendship streaks.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
  }),
  component: Landing,
});

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#goals", label: "Goals" },
  { href: "#friends", label: "Friends" },
  { href: "#faq", label: "FAQ" },
];

function Overline({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[14px] font-bold tracking-[0.01em] text-coral-text ${className}`}>
      {children}
    </p>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-paper-3/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-2.5" aria-label="mat monkey home">
          <LogoMark size={32} />
          <Wordmark className="text-[22px] text-ink" />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-4 py-2.5 text-[15px] font-semibold text-ink-secondary transition-colors hover:bg-paper-2 hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#get"
            className="btn-press hidden min-h-11 items-center rounded-full bg-primary px-5 font-display text-[15px] font-extrabold text-primary-foreground sm:inline-flex"
          >
            Get the app
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-card text-ink shadow-card md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-ink/10 bg-paper-3 px-4 pb-5 pt-2 md:hidden"
        >
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-2xl px-4 font-display text-[18px] font-extrabold tracking-[-0.015em] text-ink hover:bg-paper-2"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#get"
            onClick={() => setOpen(false)}
            className="btn-press mt-3 flex min-h-12 items-center justify-center rounded-full bg-primary font-display text-[16px] font-extrabold text-primary-foreground"
          >
            Get the app
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-paper-3">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-10 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pb-28 md:pt-16">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-[13px] font-semibold text-ink shadow-card">
            <Users className="h-4 w-4 text-primary" aria-hidden />
            The friendship-first BJJ app
          </span>
          <h1 className="mt-6 font-display text-[48px] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink sm:text-[64px] lg:text-[76px]">
            More mat time.
            <br />
            <span className="text-primary">Better company.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[17px] leading-[1.5] text-ink-secondary sm:text-[19px]">
            Plan sessions with the people you already train with, pick what you're working on, and
            keep the good rounds with a photo or a note. Weekly friendship streaks keep the crew
            showing up.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <AppStoreButton />
            <a
              href="#how"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-card px-6 font-display text-[16px] font-extrabold text-ink shadow-card transition-colors hover:bg-paper"
            >
              See how it works
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <p className="mt-4 max-w-md text-[13px] leading-snug text-ink-secondary">
            Mat Monkey (formerly Mat Mind) is on the App Store for iPhone. Planning with friends
            arrives in the next iOS update.
          </p>
        </div>

        <div className="relative mx-auto">
          <PhoneFrame
            label="Mat Monkey Training tab showing a Saturday open mat ticket with Lena, Sam and Priya going, the gym, and what they're working on"
            className="relative z-10"
          >
            <TrainingScreen />
          </PhoneFrame>
          <div className="absolute -right-4 -top-5 z-20 hidden items-center gap-2 rounded-full bg-ink py-2 pl-2 pr-4 text-[13px] font-semibold text-paper shadow-float sm:flex lg:-right-16">
            <Avatar initials="SO" hue="mint" size={26} className="ring-0" />
            Sam joined Saturday open mat
          </div>
          <div className="absolute -left-4 bottom-24 z-20 hidden w-[230px] rounded-[22px] bg-card p-3.5 shadow-float sm:block lg:-left-28">
            <div className="flex items-center gap-3">
              <TiedAvatars a="Me" b="LK" hue="sun" size={32} />
              <div className="min-w-0">
                <p className="font-display text-[15px] font-extrabold leading-tight tracking-[-0.015em] text-ink">
                  8 weeks with Lena
                </p>
                <p className="flex items-center gap-1 text-[12px] text-ink-secondary">
                  <Flame className="h-3.5 w-3.5 text-flame" aria-hidden /> This week's locked in
                </p>
              </div>
            </div>
            <div className="mt-3">
              <StreakBelt
                hue="sun"
                weeks={["done", "done", "done", "done", "done", "done", "done", "done"]}
                label="Eight weeks in a row with Lena"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  n,
  Icon,
  title,
  body,
  children,
}: {
  n: string;
  Icon: typeof Camera;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex flex-col rounded-[24px] bg-card p-6 shadow-card sm:p-7">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-coral-tint text-coral-text">
          <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </span>
        <span className="font-display text-[15px] font-extrabold text-ink-tertiary">{n}</span>
      </div>
      <h3 className="mt-5 font-display text-[26px] font-extrabold leading-tight tracking-[-0.025em] text-ink">
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-[1.5] text-ink-secondary">{body}</p>
      <div className="mt-6 flex flex-1 items-end">{children}</div>
    </article>
  );
}

function Chip({ children, selected = false }: { children: React.ReactNode; selected?: boolean }) {
  return (
    <span
      className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-[13px] font-semibold ${
        selected ? "bg-ink text-paper" : "bg-card text-ink shadow-card"
      }`}
    >
      {selected && <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />}
      {children}
    </span>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="max-w-2xl">
          <Overline>How it works</Overline>
          <h2 className="mt-3 font-display text-[36px] font-extrabold leading-none tracking-[-0.035em] text-ink sm:text-[52px]">
            Plan it. Roll it. Remember it.
          </h2>
          <p className="mt-4 text-[17px] leading-[1.5] text-ink-secondary">
            Inviting someone to train should be as easy as inviting them to hang out.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <StepCard
            n="01"
            Icon={Plus}
            title="Plan a training"
            body="Pick the gym, the time and who's invited. Add a focus so everyone knows what the rounds are for."
          >
            <div className="w-full space-y-3 rounded-[22px] bg-paper-2 p-4" aria-hidden>
              <p className="text-[12px] font-bold text-ink-secondary">Gym</p>
              <div className="flex flex-wrap gap-2">
                <Chip selected>Ironside BJJ</Chip>
                <Chip>Northside Academy</Chip>
              </div>
              <p className="pt-1 text-[12px] font-bold text-ink-secondary">Time</p>
              <div className="flex flex-wrap gap-2">
                <Chip>06:30</Chip>
                <Chip selected>10:00</Chip>
                <Chip>18:30</Chip>
              </div>
              <p className="pt-1 text-[12px] font-bold text-ink-secondary">Invite</p>
              <div className="flex items-center gap-2">
                <AvatarStack
                  size={30}
                  people={[
                    { initials: "LK", hue: "sun" },
                    { initials: "SO", hue: "mint" },
                    { initials: "PR", hue: "sky" },
                  ]}
                />
                <span className="text-[13px] font-semibold text-ink">3 friends</span>
              </div>
            </div>
          </StepCard>

          <StepCard
            n="02"
            Icon={Users}
            title="Friends join in"
            body="Sessions open to anyone with the link show up in your friends' Activity, so they can join in a tap. Friends-only plans stay private."
          >
            <div className="w-full space-y-3" aria-hidden>
              <p className="font-display text-[15px] font-extrabold tracking-[-0.015em] text-ink">
                Coming up
              </p>
              <SessionTicket
                compact
                notchClassName="bg-card"
                day="SAT"
                date="14"
                month="Nov"
                title="Saturday open mat"
                time="10:00"
                gym="Ironside BJJ"
                hue="sun"
                people={[
                  { initials: "LK", hue: "sun" },
                  { initials: "PR", hue: "sky" },
                ]}
                goingLabel="Hosted by Lena"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12px] font-semibold text-paper">
                  <CircleCheck className="h-3.5 w-3.5" aria-hidden /> You're in. See you on the mat.
                </span>
              </div>
            </div>
          </StepCard>

          <StepCard
            n="03"
            Icon={Camera}
            title="Keep the memory"
            body="After training, share a photo, a few words, or both. The post lands with everyone who trained, along with what you worked on."
          >
            <div className="relative mx-auto w-full max-w-[280px] pb-2 pt-2" aria-hidden>
              <div className="rotate-[-3deg] rounded-[8px] bg-card p-2.5 pb-4 shadow-float">
                <div className="relative overflow-hidden rounded-[4px]">
                  <img
                    src={photoGrapple.url}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                    width={900}
                    height={900}
                  />
                  <TapeLabel className="absolute left-2 top-2 text-[11px]" rotate={-4}>
                    Ironside BJJ
                  </TapeLabel>
                </div>
                <p className="mt-2.5 px-1 text-[13px] leading-snug text-ink">
                  Finally hit the knee cut on{" "}
                  <span className="font-semibold text-coral-text">@sam</span>. Twice.
                </p>
              </div>
            </div>
          </StepCard>
        </div>
      </div>
    </section>
  );
}

function GoalsSection() {
  return (
    <section id="goals" className="scroll-mt-16 bg-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Overline>Focus and goals</Overline>
          <h2 className="mt-3 font-display text-[36px] font-extrabold leading-none tracking-[-0.035em] text-ink sm:text-[52px]">
            What are you chasing?
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-[1.5] text-ink-secondary">
            Name it. Bring it to the mat. Your goals become one-tap picks when you plan a session,
            so everyone walks in knowing what the rounds are for.
          </p>
          <ul className="mt-7 space-y-3 text-[15px] text-ink">
            {[
              "Big idea first, details underneath",
              "Goals stay yours until you share them",
              "Shared goals follow the owner's edits",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-tint text-ink">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
          <div
            className="rounded-[24px] bg-paper-2 p-5"
            role="img"
            aria-label="Planning screen: What are we working on, with Knee cut picked from goals and two details"
          >
            <p className="flex items-center gap-2 font-display text-[17px] font-extrabold tracking-[-0.015em] text-ink">
              <NotebookPen className="h-4 w-4" aria-hidden /> What are we working on?
            </p>
            <p className="mt-1 text-[13px] text-ink-secondary">
              Pick from your goals, or add your own.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip selected>Knee cut</Chip>
              <Chip>
                <Plus className="h-3.5 w-3.5" aria-hidden /> Single leg
              </Chip>
              <Chip>
                <Plus className="h-3.5 w-3.5" aria-hidden /> RNC finish
              </Chip>
            </div>
            <div className="mt-4 rounded-[22px] bg-card p-4 shadow-card">
              <p className="font-display text-[16px] font-extrabold tracking-[-0.015em] text-ink">
                Knee cut
              </p>
              <ul className="mt-2 space-y-2 text-[14px] text-ink">
                {["Win the underhook first", "Pin the far hip before cutting"].map((d) => (
                  <li key={d} className="flex items-center gap-2 rounded-[14px] bg-paper px-3 py-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-tertiary" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-coral-text">
                <Plus className="h-4 w-4" aria-hidden /> Add a detail
              </p>
            </div>
          </div>

          <div
            className="rounded-[24px] bg-card p-5 shadow-card sm:mt-12"
            role="img"
            aria-label="Goals screen on the Shared tab with two goals shared between friends"
          >
            <p className="font-display text-[24px] font-extrabold tracking-[-0.03em] text-ink">
              Goals
            </p>
            <div className="mt-3 grid grid-cols-2 rounded-full bg-paper-2 p-1 text-[13px] font-bold">
              <span className="py-1.5 text-center text-ink-tertiary">Mine</span>
              <span className="rounded-full bg-card py-1.5 text-center text-ink shadow-card">
                Shared
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { t: "Single leg finishes", who: "Shared by Lena", b: "LK", hue: "sun" as const },
                {
                  t: "Escape mount without panic",
                  who: "You & Sam",
                  b: "SO",
                  hue: "mint" as const,
                },
              ].map((g) => (
                <div key={g.t} className="flex items-center gap-3 rounded-[18px] bg-paper p-3">
                  <TiedAvatars a="Me" b={g.b} hue={g.hue} size={28} />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold leading-snug text-ink">{g.t}</p>
                    <p className="text-[12px] text-ink-secondary">{g.who}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[12px] text-ink-secondary">
              <Share2 className="h-3.5 w-3.5" aria-hidden /> Updates when the owner edits
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Deterministic, decorative QR-like pattern (not scannable).
function QrArt() {
  const n = 17;
  const cells: boolean[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const finder = (x < 5 && y < 5) || (x >= n - 5 && y < 5) || (x < 5 && y >= n - 5);
      cells.push(finder ? false : (x * 7 + y * 13 + x * y) % 5 < 2);
    }
  const Finder = ({ c }: { c: string }) => (
    <span className={`absolute ${c} grid h-[29%] w-[29%] place-items-center rounded-[6px] bg-ink`}>
      <span className="grid h-[72%] w-[72%] place-items-center rounded-[4px] bg-card">
        <span className="h-[58%] w-[58%] rounded-[3px] bg-ink" />
      </span>
    </span>
  );
  return (
    <div className="relative aspect-square w-full rounded-[18px] bg-card p-3" aria-hidden>
      <div className="relative h-full w-full">
        <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {cells.map((on, i) => (
            <span key={i} className={on ? "m-[1px] rounded-[2px] bg-ink" : ""} />
          ))}
        </div>
        <Finder c="left-0 top-0" />
        <Finder c="right-0 top-0" />
        <Finder c="bottom-0 left-0" />
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[12px] bg-sun-strong">
          <LogoMark size={30} />
        </span>
      </div>
    </div>
  );
}

const LENA_WEEKS: WeekState[] = [
  "missed",
  "done",
  "done",
  "done",
  "done",
  "done",
  "done",
  "done",
  "done",
  "pending",
];
const SAM_WEEKS: WeekState[] = [
  "done",
  "done",
  "done",
  "done",
  "missed",
  "missed",
  "done",
  "pending",
];

function FriendsSection() {
  return (
    <section id="friends" className="scroll-mt-16 bg-paper-3">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Overline>Friends and streaks</Overline>
            <h2 className="mt-3 font-display text-[36px] font-extrabold leading-none tracking-[-0.035em] text-ink sm:text-[52px]">
              Summon your crew.
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-[1.5] text-ink-secondary md:justify-self-end">
            Connect with training partners by QR code or username. Train together once in a
            Monday-to-Sunday week and your friendship streak grows by one belt segment.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[24px] bg-sun p-6 sm:p-7">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              <QrCode className="h-5 w-5" aria-hidden /> Add friends in person
            </div>
            <div className="mx-auto mt-5 w-full max-w-[240px]">
              <QrArt />
            </div>
            <p className="mt-5 text-center font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink">
              Scan to add Lena
            </p>
            <p className="text-center text-[14px] text-ink-secondary">or find her as @lena.rolls</p>
            <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-card py-2.5 text-[14px] font-semibold text-ink">
              <UserPlus className="h-4 w-4" aria-hidden /> You & Lena are friends
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[24px] bg-card p-6 shadow-card sm:p-7">
              <div className="flex items-center gap-4">
                <TiedAvatars a="Me" b="LK" hue="sun" size={48} />
                <div className="min-w-0">
                  <p className="font-display text-[24px] font-extrabold leading-tight tracking-[-0.025em] text-ink">
                    8 weeks with Lena
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[14px] text-ink-secondary">
                    <Flame className="h-4 w-4 shrink-0 text-flame" aria-hidden /> Roll together by
                    Sunday to make it 9
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <StreakBelt
                  hue="sun"
                  weeks={LENA_WEEKS}
                  label="Eight weeks in a row with Lena, this week still open"
                />
                <div className="mt-2 flex justify-between text-[11px] font-semibold text-ink-tertiary">
                  <span>10 weeks ago</span>
                  <span>This week</span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] bg-mint-tint p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <TiedAvatars a="Me" b="SO" hue="mint" size={44} />
                <div className="min-w-0">
                  <p className="font-display text-[20px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
                    Pick it back up with Sam
                  </p>
                  <p className="text-[14px] text-ink-secondary">1 week so far · best 4 weeks</p>
                </div>
              </div>
              <div className="mt-5">
                <StreakBelt
                  hue="mint"
                  weeks={SAM_WEEKS}
                  label="Streak with Sam: one week so far, best four weeks"
                />
              </div>
              <p className="mt-4 text-[14px] text-ink-secondary">
                Missed weeks are just bare mat. No guilt, no leaderboards.
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {[
            "People you already train with",
            "You choose who's invited",
            "No DMs or stranger matching",
            "No rankings",
          ].map((t) => (
            <li
              key={t}
              className="rounded-full bg-card px-4 py-2 text-[14px] font-semibold text-ink shadow-card"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: "Is Mat Monkey the same app as Mat Mind?",
    a: "Yes. Mat Monkey is the new name for Mat Mind, and it lives at the same App Store listing. The redesigned app shifts the focus to training with friends.",
  },
  {
    q: "When can I plan sessions with friends?",
    a: "Planning with friends, shared goals and friendship streaks arrive in the next iOS update. The current version is available on the App Store today.",
  },
  {
    q: "Is it on Android?",
    a: "Not yet. Mat Monkey is iPhone only for now.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. Friends, invitations and shared goals need an account so your sessions reach the right people.",
  },
  {
    q: "Who can see my sessions?",
    a: "You choose who's invited. Sessions open to anyone with the link appear in your friends' Activity so they can join. Friends-only sessions stay out of the feed.",
  },
  {
    q: "How do friendship streaks work?",
    a: "A week counts when you and a friend both complete at least one session together between Monday and Sunday. Consecutive weeks grow the belt. Miss one and you simply pick it back up.",
  },
  {
    q: "Can strangers find or message me?",
    a: "Mat Monkey is for people you already train with. You connect by QR code or username, and there are no DMs, public matching or rankings.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="scroll-mt-16 bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Overline>FAQ</Overline>
          <h2 className="mt-3 font-display text-[36px] font-extrabold leading-none tracking-[-0.035em] text-ink sm:text-[52px]">
            Questions before the first round.
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`faq-${i}`}
              className="rounded-[22px] border-0 bg-card px-5 shadow-card"
            >
              <AccordionTrigger className="min-h-14 py-4 font-display text-[17px] font-extrabold tracking-[-0.015em] text-ink hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-[1.55] text-ink-secondary">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function UpdateNotify() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      toast.error("That email doesn't look right.");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email: trimmed, source: "footer_waitlist" });
    setLoading(false);
    if (error && error.code !== "23505") {
      toast.error("Something went wrong. Try again?");
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("You're on the list. See you on the mat.");
  };

  if (done) {
    return (
      <p className="flex items-center gap-2 text-[15px] font-semibold text-ink" role="status">
        <CircleCheck className="h-5 w-5" aria-hidden /> You're on the list for the update.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <label htmlFor="notify-email" className="text-[14px] font-semibold text-ink">
        Want a heads-up when the friends update lands?
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="notify-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-12 w-full min-w-0 rounded-[14px] border-[1.5px] border-ink/15 bg-card px-4 text-[15px] text-ink placeholder:text-ink-tertiary"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 shrink-0 rounded-full bg-ink px-6 font-display text-[15px] font-extrabold text-paper transition-transform active:translate-y-[2px] disabled:opacity-60"
        >
          {loading ? "Sending…" : "Notify me"}
        </button>
      </div>
    </form>
  );
}

function ClosingCta() {
  return (
    <section id="get" className="scroll-mt-16 bg-paper px-4 pb-20 sm:px-6 md:pb-28">
      <div className="mx-auto grid max-w-6xl gap-10 overflow-hidden rounded-[32px] bg-primary px-6 py-12 sm:px-10 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-16 lg:px-16">
        <div className="min-w-0">
          <LogoMark size={56} mono />
          <h2 className="mt-6 font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink sm:text-[60px]">
            Rolls are better with friends.
          </h2>
          <p className="mt-4 max-w-md text-[17px] leading-[1.5] text-ink">
            Get Mat Monkey on iPhone now. Planning with friends arrives in the next iOS update.
          </p>
          <div className="mt-8">
            <AppStoreButton variant="white" />
          </div>
        </div>
        <div className="rounded-[24px] bg-coral-tint p-6">
          <UpdateNotify />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-paper-3">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Back to top">
          <LogoMark size={28} />
          <Wordmark className="text-[20px] text-ink" />
        </a>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-semibold text-ink-secondary"
        >
          <a href="/privacy" className="py-2 hover:text-ink">
            Privacy
          </a>
          <a href="#faq" className="py-2 hover:text-ink">
            FAQ
          </a>
          <span className="py-2">© {new Date().getFullYear()} Mat Monkey</span>
        </nav>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Toaster />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <GoalsSection />
        <FriendsSection />
        <FAQ />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
