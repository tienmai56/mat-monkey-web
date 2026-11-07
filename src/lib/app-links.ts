export const APP_STORE_URL =
  "https://apps.apple.com/us/app/mat-mind-jiu-jitsu-planner/id6767997652";

// Matches the team and bundle ID in the iOS project. Verify the production App
// Identifier Prefix before publishing if its signing team has ever changed.
export const APP_IDENTIFIER = "9R4A2F8F94.com.tienmai.intentionaltrainingnotes";
export const ASSOCIATION_PATH = "/.well-known/apple-app-site-association";
// Keep copied links, social previews and canonical URLs on the custom domain,
// including when a crawler requests a page through an older hosting address.
export const APP_LINK_ORIGIN = "https://mymatmonkey.com";
export const PREVIEW_VERSION = "20261105.1";

export const appleAppSiteAssociation = {
  applinks: {
    details: [
      {
        appIDs: [APP_IDENTIFIER],
        components: [{ "/": "/friend/*" }, { "/": "/session/*" }, { "/": "/goal/*" }],
      },
    ],
  },
};

export type InvitationKind = "friend" | "session" | "goal";

export function invitationAppURL(kind: InvitationKind, token: string): string | null {
  // Validate the complete token before creating any custom-scheme destination.
  // This checks structure only; authentication and redemption happen in iOS.
  if (!/^[a-f0-9]{64}$/i.test(token)) return null;
  return `matmind://${kind}/${token.toLowerCase()}`;
}

export function associationResponse(method: string): Response {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
    Allow: "GET, HEAD",
  };
  if (method !== "GET" && method !== "HEAD") {
    return new Response(null, { status: 405, headers });
  }
  return new Response(method === "HEAD" ? null : JSON.stringify(appleAppSiteAssociation), {
    status: 200,
    headers,
  });
}

export function protectInvitationResponse(response: Response, pathname: string): Response {
  if (
    !/^\/(friend|session|goal)(\/|$)/.test(pathname) &&
    !/^\/share\/preview\/(friend|session|goal)\//.test(pathname)
  )
    return response;
  const headers = new Headers(response.headers);
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Mat-Monkey-Preview-Version", PREVIEW_VERSION);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
