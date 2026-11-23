import { cn } from "@/lib/utils";

/**
 * Onboarding crew monkey from the app: MMMonkeyLook(mood: .happy, fur: .smoke,
 * haircut: .topknot), serialized "happy.ink-500.topknot". Ported 1:1 from the
 * app's 200x200 renderer. Do not add accessories or change the configuration.
 */
export function CrewMonkey({ className }: { className?: string }) {
  const fur = "var(--ink-tertiary)";
  const face = "var(--card)";
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      <circle cx={100} cy={30} r={15} fill={fur} />
      <circle cx={36} cy={100} r={23} fill={fur} />
      <circle cx={164} cy={100} r={23} fill={fur} />
      <circle cx={31} cy={100} r={10} fill={face} />
      <circle cx={169} cy={100} r={10} fill={face} />
      <circle cx={100} cy={100} r={62} fill={fur} />
      <circle cx={82} cy={96} r={25} fill={face} />
      <circle cx={118} cy={96} r={25} fill={face} />
      <ellipse cx={100} cy={124} rx={36} ry={28} fill={face} />
      <circle cx={84} cy={98} r={7} fill={fur} />
      <circle cx={116} cy={98} r={7} fill={fur} />
      <path
        d="M86 128 Q100 138 114 128"
        fill="none"
        stroke={fur}
        strokeWidth={7}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Decorative headline accent: the crew monkey on a pale round backing. */
export function HeadlineMonkey({
  tone = "paper",
  className,
}: {
  tone?: "paper" | "sun";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid h-12 w-12 shrink-0 place-items-center rounded-full shadow-card sm:h-14 sm:w-14",
        tone === "sun" ? "bg-sun" : "bg-card",
        className,
      )}
    >
      <CrewMonkey className="h-9 w-9 sm:h-10 sm:w-10" />
    </span>
  );
}
