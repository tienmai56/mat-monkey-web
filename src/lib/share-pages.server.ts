import {
  APP_LINK_ORIGIN,
  BETA_URL,
  invitationAppURL,
  protectInvitationResponse,
  type InvitationKind,
} from "./app-links";
import {
  isInvitationToken,
  lookupInvitation,
  participantSummary,
  previewCopy,
  sessionDate,
  type InvitationPreview,
  type PreviewEnvironment,
  type PreviewResult,
} from "./invitation-preview";

export function escapeHTML(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );
}

export function invitationHTML(kind: InvitationKind, token: string, result: PreviewResult): string {
  const active = result.state === "active" ? result.preview : undefined;
  const session = active?.kind === "session" ? active : undefined;
  const unavailable = result.state === "unavailable";
  const copy = previewCopy(kind, active);
  const title = unavailable ? "This link is no longer available · Mat Monkey" : copy.title;
  const description = unavailable
    ? "Ask your training partner for a new invitation link."
    : copy.description;
  const path = `/${kind}/${token.toLowerCase()}`;
  const imagePath = active
    ? `/share/preview/${kind}/${token.toLowerCase()}.png`
    : "/share/preview/app.png";
  const appURL = unavailable ? null : invitationAppURL(kind, token);
  const e = escapeHTML;
  const summary = session
    ? `<dl class="details"><div><dt>When</dt><dd>${e(sessionDate(session).full)}</dd></div><div><dt>Where</dt><dd>${e(session.venue)}</dd></div>${session.participants.length ? `<div><dt>Who’s training</dt><dd>${e(participantSummary(session))}</dd></div>` : ""}${session.focus.length ? `<div><dt>What we’re working on</dt><dd class="chips">${session.focus.map((item) => `<span>${e(item)}</span>`).join("")}</dd></div>` : ""}</dl>`
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title>
<meta name="description" content="${e(description)}"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer">
<meta property="og:type" content="website"><meta property="og:site_name" content="Mat Monkey"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(APP_LINK_ORIGIN + path)}">
<meta property="og:image" content="${e(APP_LINK_ORIGIN + imagePath)}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${e(description)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(description)}"><meta name="twitter:image" content="${e(APP_LINK_ORIGIN + imagePath)}"><meta name="twitter:image:alt" content="${e(description)}">
${appURL ? `<meta name="apple-itunes-app" content="app-id=6767997652, app-argument=${e(APP_LINK_ORIGIN + path)}">` : ""}
<link rel="canonical" href="${e(APP_LINK_ORIGIN + path)}"><link rel="stylesheet" href="/share-assets/share.css"><link rel="icon" href="/share-assets/logo-mark.svg" type="image/svg+xml"></head>
<body><header><a class="brand" href="/"><img src="/share-assets/logo-mark.svg" width="36" height="40" alt=""><span>mat monkey<span class="period">.</span></span></a></header><main><article class="invitation">
${active ? `<img class="ticket" src="${e(imagePath)}" width="1200" height="630" alt="${e(description)}">` : ""}
<div class="content"><p class="label">${kind === "session" ? "Training session" : kind === "goal" ? "Shared goal" : "Friend invite"}</p><h1>${e(session?.title ?? (unavailable ? "This link is no longer available" : kind === "session" ? "You’re invited. Let’s roll." : kind === "friend" ? "Good rounds. Better company." : "Bring a goal. Build your game."))}</h1>
${summary || `<p class="intro">${e(unavailable ? description : result.state === "offline" ? "The preview isn’t available right now. Open Mat Monkey to check your invitation, or try this page again shortly." : copy.description)}</p>`}
<div class="actions">${appURL ? `<a class="button primary" href="${e(appURL)}">Open in Mat Monkey</a>` : ""}<a class="button ${appURL ? "secondary" : "primary"}" href="${e(BETA_URL)}" rel="noreferrer">Join the Mat Monkey beta</a></div>
${appURL ? '<p class="hint">Sign in to continue to this invitation. Installing for the first time? Return to this original link after installing, then open it again.</p>' : ""}
</div></article></main><footer><a href="/">About Mat Monkey</a></footer></body></html>`;
}

type Dependencies = {
  lookup?: typeof lookupInvitation;
  image?: (kind: InvitationKind | "app", preview?: InvitationPreview) => Promise<Response>;
};

// Served before TanStack SSR so every crawler receives complete metadata without
// running JavaScript. The rest of the landing site still uses its existing SSR.
export async function shareResponse(
  request: Request,
  env: PreviewEnvironment,
  dependencies: Dependencies = {},
): Promise<Response | null> {
  const pathname = new URL(request.url).pathname;
  const isAppImage = pathname === "/share/preview/app.png";
  const page = /^\/(friend|session|goal)\/([^/]+)\/?$/.exec(pathname);
  const image = /^\/share\/preview\/(friend|session|goal)\/([^/]+)\.png$/.exec(pathname);
  if (!isAppImage && !page && !image) return null;
  const protect = (response: Response) => protectInvitationResponse(response, pathname);
  if (!["GET", "HEAD"].includes(request.method))
    return protect(new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } }));
  const render =
    dependencies.image ??
    (async (kind, preview) => (await import("./share-image.server")).shareImage(kind, preview));
  if (isAppImage) {
    if (request.method === "HEAD")
      return new Response(null, {
        headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
      });
    return render("app");
  }
  const match = (page ?? image)!;
  const kind = match[1] as InvitationKind;
  const token = match[2];
  const result = await (dependencies.lookup ?? lookupInvitation)(kind, token, env);
  const status = result.state === "unavailable" ? 404 : result.state === "offline" ? 503 : 200;
  if (image) {
    if (result.state !== "active")
      return protect(
        new Response(null, {
          status,
          headers: result.state === "offline" ? { "Retry-After": "60" } : {},
        }),
      );
    if (request.method === "HEAD")
      return protect(new Response(null, { headers: { "Content-Type": "image/png" } }));
    return protect(await render(kind, result.preview));
  }
  // Never build a native destination from an invalid token, even with injected
  // dependencies. HTML escaping is independent of structural link validation.
  const safeResult = isInvitationToken(token) ? result : { state: "unavailable" as const };
  return protect(
    new Response(request.method === "HEAD" ? null : invitationHTML(kind, token, safeResult), {
      status: safeResult.state === "unavailable" ? 404 : status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy":
          "default-src 'none'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
        ...(status === 503 ? { "Retry-After": "60" } : {}),
      },
    }),
  );
}
