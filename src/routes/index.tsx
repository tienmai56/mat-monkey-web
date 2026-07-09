import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import disciplineImg from "@/assets/section-discipline.jpg";
import logo from "@/assets/mat-mind-logo.png";
import appHero from "@/assets/app-hero.png.asset.json";
import appGoalsV2 from "@/assets/app-goals-v2.png.asset.json";
import appPlanV2 from "@/assets/app-plan-v2.png.asset.json";
import appShareV2 from "@/assets/app-share-v2.png.asset.json";
import appBounty from "@/assets/app-bounty.png.asset.json";
import appBountyUnlocked from "@/assets/app-bounty-unlocked.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mat Mind — Plan and reflect on your BJJ training" },
      {
        name: "description",
        content:
          "A training planner and reflection journal for jiu-jitsu. Set goals, plan what to work on before each class, then reflect after. Train with intention, not just attendance.",
      },
      { property: "og:title", content: "Mat Mind — Plan and reflect on your BJJ training" },
      {
        property: "og:description",
        content:
          "Plan what to work on before class, reflect after. Train with intention, not just attendance.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-2 group">
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

function BetaDialog({ trigger }: { trigger: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email: trimmed, source: "hero_dialog" });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        setSubmitted(true);
        toast.success("You're already on the list — we'll be in touch.");
        return;
      }
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("You're on the list. We'll be in touch.");
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setEmail("");
          setSubmitted(false);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            Become a Beta user
          </DialogTitle>
          <DialogDescription>
            Drop your email and we'll send your invite to become a beta user. No spam. No advertisement
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <p className="text-sm text-muted-foreground py-2">
            You're on the list. We'll be in touch soon.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3 pt-2">
            <Input
              type="email"
              required
              placeholder="jane.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              autoFocus
            />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-12 rounded-xl font-bold tracking-wide hover:opacity-90 disabled:opacity-60"
              style={{
                background: "var(--coral, oklch(0.62 0.20 295))",
                color: "white",
              }}
            >
              {loading ? "Submitting…" : "Request beta access"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}



function HeroPhone() {
  return (
    <div className="relative mx-auto w-[300px] sm:w-[360px]">
      <div className="absolute -inset-12 rounded-[3rem] bg-primary/20 blur-3xl" aria-hidden />
      <img
        src={appHero.url}
        alt="Mat Mind home screen showing a 2 week streak, next session Takedowns, and latest reflection on Back Control"
        width={1276}
        height={2204}
        className="relative w-full h-auto rounded-[2.5rem] drop-shadow-2xl ring-1 ring-border/40"
      />
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="border-b border-border/60">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:py-24 md:gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <span aria-hidden>★</span> Free Beta · iOS
          </span>
          <h1 className="mt-6 font-heading text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.02] tracking-tight">
            Train with
            <br />
            <span style={{ color: "var(--coral, oklch(0.62 0.20 295))" }}>
              purpose
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed">
            Plan your training before class, then reflect on it after.
            Mat Mind helps you turn every session into deliberate practice —
            so mat time actually compounds into progress.
          </p>
          <p className="mt-5 text-sm font-medium text-muted-foreground/80">
            No ads. No subscriptions. No paywalls.
          </p>
          <div className="mt-8">
            <BetaDialog
              trigger={
                <Button
                  size="lg"
                  className="h-14 rounded-2xl px-7 text-base font-bold tracking-wide shadow-lg hover:opacity-90"
                  style={{
                    background: "var(--coral, oklch(0.62 0.20 295))",
                    color: "white",
                  }}
                >
                  BECOME A BETA USER
                </Button>
              }
            />
          </div>
        </div>

        <div className="relative">
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      emoji: "🎯",
      title: "Set up Goals & Tasks",
      body: "Define what you want to improve and break it into specific tasks. Schedule which days to drill each one so every class has a clear focus.",
    },
    {
      emoji: "📝",
      title: "Reflect",
      body: "After class, capture what worked, where you got stuck, and what to adjust. Reflections are tied to the plan, not floating notes.",
    },
    {
      emoji: "💬",
      title: "Get Feedback",
      body: "Share a session with a coach or training partner and turn their input into the next week's plan.",
    },
    {
      emoji: "🔒",
      title: "Completely Private",
      body: "Your plans and reflections stay on your device. No accounts, no tracking, no ads. Lock it with Face ID or Touch ID.",
    },
  ];

  return (
    <section className="border-b border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight">
            Plan, train, reflect — on repeat
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Everything you need to plan your training and learn from every session.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-background p-7 shadow-sm border border-border/40 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-5" aria-hidden>
                {f.emoji}
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function Banner() {
  return (
    <section className="border-b border-border/60">
      <div className="relative h-[280px] md:h-[400px] overflow-hidden">
        <img
          src={disciplineImg}
          alt="A worn jiu-jitsu belt next to a notebook and pen"
          width={1920}
          height={1080}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        <div className="relative mx-auto max-w-6xl h-full px-6 flex items-center">
          <blockquote className="max-w-lg">
            <p className="font-heading text-2xl md:text-4xl font-semibold leading-tight">
              "Reflection without a preset goal is like grading a test without a rubric."
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              The reason we built this.
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function WhyIBuiltThis() {
  return (
    <section className="border-b border-border/60 bg-card/30">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Why I built this
        </span>
        <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 leading-tight">
          A hobbyist's tool for training that actually compounds.
        </h2>
        <div className="mt-8 space-y-5 text-[17px] text-muted-foreground leading-relaxed">
          <p>
            As a hobbyist jiu-jitsu athlete myself, I noticed that the fastest
            way to get better is to step onto the mats with a specific goal.
            With an intention.
          </p>
          <p>
            But let's be real, we've got a capitalist grind to survive. We
            can't all train like world champions, but we can still have fun
            and see serious progress!
          </p>
          <p>Mat Mind takes the headache out of intentional training.</p>
          <p>
            It lets you break down goals into quick daily tasks, track what's
            working, get quick feedback from coaches, and even set fun
            bounties.
          </p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const items = [
    {
      emoji: "🎯",
      title: "Set up Goals & Tasks",
      body: "Define what you want to improve and break it into specific tasks. Schedule which days to drill each one so every class has a clear focus.",
    },
    {
      emoji: "📝",
      title: "Reflect",
      body: "After class, capture what worked, where you got stuck, and what to adjust. Reflections are tied to the plan, not floating notes.",
    },
    {
      emoji: "💬",
      title: "Get Feedback",
      body: "Share a session with a coach or training partner and turn their input into the next week's plan.",
    },
    {
      emoji: "🎉",
      title: "Make it fun!",
      body: "Set a fun bounty after meeting your training plan and reflection for a period of time.",
    },
    {
      emoji: "🔒",
      title: "Completely Private",
      body: "Your plans and reflections stay on your device. No accounts, no tracking, no ads. Lock it with Face ID or Touch ID.",
    },
  ];

  return (
    <section id="how" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            How it works
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3">
            A planning and reflection loop that turns mat time into measurable progress.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-card p-7 shadow-sm border border-border/40 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-5" aria-hidden>
                {f.emoji}
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewMockups() {
  const shots = [
    {
      src: appGoalsV2.url,
      alt: "Active Goals screen with Guard Retention and Sweeps, broken into specific tasks",
      caption: "Goals — break a theme into specific tasks.",
      offset: "md:translate-y-8",
    },
    {
      src: appPlanV2.url,
      alt: "Plan screen showing June calendar with scheduled training and a Guard Retention session",
      caption: "Plan — schedule what to hunt for each class.",
      offset: "",
    },
    {
      src: appShareV2.url,
      alt: "Share preview formatted as a letter to training partners asking for feedback on Back Control",
      caption: "Reflect & share — review the session, ask for feedback.",
      offset: "md:translate-y-8",
    },
    {
      src: appBountyUnlocked.url,
      alt: "Home screen showing a 2 week streak with a Bounty Unlocked card prompting to set a challenge",
      caption: "Bounty unlocked — turn consistency into a fun challenge.",
      offset: "",
    },
  ];

  return (
    <section className="border-b border-border/60 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Inside the app
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3">
            One screen to plan. One to train against. One to reflect honestly.
          </h2>
        </div>

        <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 md:gap-6 items-start justify-items-center">
          {shots.map((s) => (
            <figure key={s.caption} className={`w-full max-w-[300px] ${s.offset}`}>
              <img
                src={s.src}
                alt={s.alt}
                width={1276}
                height={2204}
                loading="lazy"
                className="w-full h-auto rounded-[2.5rem] drop-shadow-2xl ring-1 ring-border/40"
              />

              <figcaption className="mt-5 text-center text-sm text-muted-foreground">
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Is it free?",
      a: "Yes — Mat Mind is completely free. No subscriptions, no paywalls, no ads.",
    },
    {
      q: "Where is my data stored?",
      a: "Everything lives locally on your device. Your plans and reflections never leave your phone unless you choose to share them.",
    },
    {
      q: "Who is it for?",
      a: "Anyone who trains — hobbyists who want training to feel fun and intentional, and professional athletes who need a sharper, more effective practice. The goal is the same: make every mat session count.",
    },
    {
      q: "When does it launch?",
      a: "Closed beta in the coming weeks. Beta users get first access.",
    },
    {
      q: "iOS or Android?",
      a: "iOS first. Android is on the roadmap once the iOS app is stable.",
    },
    {
      q: "Is there a web version?",
      a: "Not at launch. Planning and reflection work best as a quick mobile capture before and after class.",
    },
  ];

  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-10">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            FAQ
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3">
            Questions, answered.
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-heading text-base font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email: trimmed, source: "footer_waitlist" });
    setLoading(false);
    if (error && error.code !== "23505") {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success(
      error?.code === "23505"
        ? "You're already on the list — we'll be in touch."
        : "You're on the list. We'll be in touch.",
    );
    setEmail("");
  };

  return (
    <section id="waitlist" className="border-b border-border/60">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight">
          Plan your training. Reflect on every roll.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Join the waitlist and we'll let you know when the beta opens.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-card border-border"
          />
          <Button type="submit" size="lg" disabled={loading} className="font-medium disabled:opacity-60">
            {loading ? "Submitting…" : submitted ? "You're in" : "Join waitlist"}
          </Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          No spam. One email when the beta opens.
        </p>
      </div>
    </section>
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

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <Nav />
      <main>
        <Hero />
        <WhyIBuiltThis />
        <HowItWorks />
        <PreviewMockups />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
