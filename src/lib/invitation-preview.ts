import type { InvitationKind } from "./app-links";

export type SessionPreview = {
  kind: "session";
  title: string;
  starts_at: string;
  timezone: string;
  venue: string;
  participants: string[];
  participant_count: number;
  focus: string[];
};
export type InvitationPreview = SessionPreview | { kind: "friend" | "goal" };
export type PreviewResult =
  | { state: "active"; preview: InvitationPreview }
  | { state: "unavailable" }
  | { state: "offline" };
export type PreviewEnvironment = {
  // Deliberately separate from the landing site's Lovable Supabase project.
  MAT_MONKEY_SUPABASE_URL?: string;
  MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY?: string;
};

export function previewEnvironment(request: Request, bindings?: unknown): PreviewEnvironment {
  // Direct Workers pass bindings as fetch's second argument. Nitro forwards a
  // single augmented Request to the SSR entry, with per-request bindings here.
  const runtime = (request as Request & { runtime?: { cloudflare?: { env?: PreviewEnvironment } } })
    .runtime;
  const env = {
    ...runtime?.cloudflare?.env,
    ...(bindings && typeof bindings === "object" ? bindings : {}),
  } as PreviewEnvironment;
  return {
    MAT_MONKEY_SUPABASE_URL: env.MAT_MONKEY_SUPABASE_URL,
    MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY: env.MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY,
  };
}

export const isInvitationToken = (token: string) => /^[a-f0-9]{64}$/i.test(token);

function strings(value: unknown, limit: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= 3 &&
    value.every((v) => typeof v === "string" && v.length <= limit)
  );
}

export function validatePreview(value: unknown, kind: InvitationKind): InvitationPreview | null {
  if (!value || typeof value !== "object") return null;
  const p = value as Record<string, unknown>;
  if (p.kind !== kind) return null;
  if (kind !== "session") return { kind };
  if (
    typeof p.title !== "string" ||
    !p.title.trim() ||
    p.title.length > 160 ||
    typeof p.venue !== "string" ||
    p.venue.length > 240 ||
    typeof p.starts_at !== "string" ||
    !Number.isFinite(Date.parse(p.starts_at)) ||
    typeof p.timezone !== "string" ||
    p.timezone.length > 100 ||
    !strings(p.participants, 80) ||
    !strings(p.focus, 120) ||
    !Number.isSafeInteger(p.participant_count) ||
    (p.participant_count as number) < p.participants.length
  )
    return null;
  try {
    new Intl.DateTimeFormat("en", { timeZone: p.timezone }).format(new Date(p.starts_at));
  } catch {
    return null;
  }
  // Explicit projection: unexpected backend fields cannot reach HTML or images.
  return {
    kind: "session",
    title: p.title,
    venue: p.venue,
    starts_at: p.starts_at,
    timezone: p.timezone,
    participants: p.participants,
    participant_count: p.participant_count as number,
    focus: p.focus,
  };
}

export async function lookupInvitation(
  kind: InvitationKind,
  token: string,
  env: PreviewEnvironment,
  fetcher: typeof fetch = fetch,
): Promise<PreviewResult> {
  if (!isInvitationToken(token)) return { state: "unavailable" };
  const base = env.MAT_MONKEY_SUPABASE_URL;
  const key = env.MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return { state: "offline" };
  try {
    const url = new URL(base);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      return { state: "offline" };
    const headers: Record<string, string> = { "Content-Type": "application/json", apikey: key };
    if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
    const response = await fetcher(new URL("/rest/v1/rpc/invitation_preview", url), {
      method: "POST",
      headers,
      body: JSON.stringify({ link_kind: kind, token: token.toLowerCase() }),
      signal: AbortSignal.timeout(3500),
      redirect: "error",
    });
    if (!response.ok) return { state: "offline" };
    const raw: unknown = await response.json();
    if (raw === null) return { state: "unavailable" };
    const preview = validatePreview(raw, kind);
    return preview ? { state: "active", preview } : { state: "offline" };
  } catch {
    // Never log the token, upstream body, API key, or private invitation data.
    return { state: "offline" };
  }
}

export function sessionDate(session: SessionPreview) {
  const date = new Date(session.starts_at);
  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: session.timezone, ...options }).format(date);
  return {
    day: format({ weekday: "short" }).toUpperCase(),
    number: format({ day: "numeric" }),
    month: format({ month: "long" }),
    time: format({ hour: "numeric", minute: "2-digit" }),
    zone: format({ timeZoneName: "short" }).split(", ").pop()!.split(" ").pop()!,
    full: format({
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }),
  };
}

export function participantSummary(session: SessionPreview) {
  const names = session.participants.join(", ");
  const extra = session.participant_count - session.participants.length;
  return names + (extra > 0 ? ` + ${extra} more` : "");
}

export function previewCopy(kind: InvitationKind | "app", preview?: InvitationPreview) {
  if (preview?.kind === "session") {
    const people = participantSummary(preview);
    const details = [sessionDate(preview).full, preview.venue];
    if (people) details.push(`Training with ${people}`);
    if (preview.focus.length) details.push(`Working on ${preview.focus.join(" & ")}`);
    return { title: `${preview.title} · Mat Monkey`, description: details.join(" · ") };
  }
  const copy = {
    session: {
      title: "You’re invited to train · Mat Monkey",
      description: "Open your training session invitation in Mat Monkey.",
    },
    friend: {
      title: "Let’s train together · Mat Monkey",
      description: "Connect with a training partner in Mat Monkey.",
    },
    goal: {
      title: "A goal was shared with you · Mat Monkey",
      description: "Open Mat Monkey to see what’s next on the mat.",
    },
    app: {
      title: "Meet you on the mat · Mat Monkey",
      description: "Plan sessions, connect with partners, and train together.",
    },
  };
  return copy[kind];
}
