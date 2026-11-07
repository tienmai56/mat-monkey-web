import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** The original Silverback mark. Never redraw or recolor — always load the file. */
export function LogoMark({
  size = 32,
  mono = false,
  className,
}: {
  size?: number;
  mono?: boolean;
  className?: string;
}) {
  return (
    <img
      src={mono ? "/share-assets/logo-mark-mono.svg" : "/share-assets/logo-mark.svg"}
      alt=""
      aria-hidden
      width={Math.round((size * 228) / 256)}
      height={size}
      className={cn("shrink-0", className)}
      style={{ height: size, width: "auto" }}
    />
  );
}

export function Wordmark({
  className,
  periodClassName = "text-primary",
}: {
  className?: string;
  periodClassName?: string;
}) {
  return (
    <span className={cn("font-display font-extrabold tracking-[-0.04em] lowercase", className)}>
      mat monkey<span className={periodClassName}>.</span>
    </span>
  );
}

export type Hue = "sun" | "mint" | "sky" | "plum" | "coral";

export const hueTint: Record<Hue, string> = {
  sun: "bg-sun",
  mint: "bg-mint-tint",
  sky: "bg-sky",
  plum: "bg-plum",
  coral: "bg-coral-tint",
};

export const hueStrong: Record<Hue, string> = {
  sun: "bg-sun-strong",
  mint: "bg-mint-strong",
  sky: "bg-sky-strong",
  plum: "bg-plum-strong",
  coral: "bg-primary",
};

export function Avatar({
  initials,
  hue,
  size = 30,
  className,
}: {
  initials: string;
  hue: Hue;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-display font-extrabold text-ink ring-[2.5px] ring-card",
        hueTint[hue],
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * (initials.length > 2 ? 0.3 : 0.38)),
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function AvatarStack({
  people,
  size = 28,
}: {
  people: { initials: string; hue: Hue }[];
  size?: number;
}) {
  return (
    <span className="flex">
      {people.map((p, i) => (
        <span key={p.initials + i} style={{ marginLeft: i === 0 ? 0 : -size * 0.32 }}>
          <Avatar {...p} size={size} />
        </span>
      ))}
    </span>
  );
}

/** Two overlapping avatars joined by a small hue "knot" — the friendship mark. */
export function TiedAvatars({
  a,
  b,
  hue,
  size = 40,
}: {
  a: string;
  b: string;
  hue: Hue;
  size?: number;
}) {
  return (
    <span className="relative inline-flex shrink-0 items-center" aria-hidden>
      <Avatar initials={a} hue="coral" size={size} />
      <span style={{ marginLeft: -size * 0.28 }}>
        <Avatar initials={b} hue={hue} size={size} />
      </span>
      <span
        className={cn(
          "absolute left-1/2 -translate-x-1/2 rounded-full ring-2 ring-card",
          hueStrong[hue],
        )}
        style={{ bottom: -3, width: size * 0.42, height: 6 }}
      />
    </span>
  );
}

/** Slightly rotated athletic-tape strip used on training photos. */
export function TapeLabel({
  children,
  className,
  rotate = -3,
}: {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      className={cn(
        "inline-block bg-paper px-3 py-1.5 text-[13px] font-semibold text-ink shadow-card",
        className,
      )}
      style={{
        transform: `rotate(${rotate}deg)`,
        clipPath:
          "polygon(0 8%, 3% 0, 97% 4%, 100% 0, 99% 50%, 100% 92%, 96% 100%, 4% 96%, 0 100%, 1% 50%)",
      }}
    >
      {children}
    </span>
  );
}

export type WeekState = "done" | "missed" | "pending";

/** Weekly friendship streak: each calendar week is one belt segment. */
export function StreakBelt({ weeks, hue, label }: { weeks: WeekState[]; hue: Hue; label: string }) {
  return (
    <div className="flex h-4 w-full items-stretch" role="img" aria-label={label}>
      {weeks.map((w, i) => {
        const prev = weeks[i - 1];
        const next = weeks[i + 1];
        const joinedLeft = w === "done" && prev === "done";
        const joinedRight = w === "done" && next === "done";
        return (
          <span
            key={i}
            className={cn(
              "relative flex-1",
              w === "done" && hueStrong[hue],
              w === "missed" && "rounded-full bg-paper-3",
              w === "pending" && "hatch rounded-full ring-1 ring-ink/20 ring-inset",
              w === "done" && !joinedLeft && "rounded-l-full",
              w === "done" && !joinedRight && "rounded-r-full",
              i > 0 && !joinedLeft && "ml-1",
            )}
          >
            {w === "done" && <span className="absolute inset-y-0 right-[30%] w-[3px] bg-card/90" />}
          </span>
        );
      })}
    </div>
  );
}

export function AppStoreButton({
  variant = "coral",
  className,
}: {
  variant?: "coral" | "white";
  className?: string;
}) {
  return (
    <a
      href="https://testflight.apple.com/join/csjcMYCB"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 font-display text-[17px] font-extrabold tracking-[-0.015em]",
        variant === "coral"
          ? "btn-press bg-primary text-primary-foreground"
          : "btn-press-ink bg-card text-ink hover:bg-paper",
        className,
      )}
    >
      Try the beta app
      <ArrowUpRight className="h-5 w-5" strokeWidth={2.25} aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
