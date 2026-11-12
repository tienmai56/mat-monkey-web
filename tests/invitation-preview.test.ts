import { describe, expect, test } from "bun:test";
import { APP_LINK_ORIGIN } from "../src/lib/app-links";
import { deploymentPreviewEnvironment } from "../src/lib/share-deployment.server";
import { invitationHTML, shareResponse } from "../src/lib/share-pages.server";
import {
  lookupInvitation,
  previewEnvironment,
  participantSummary,
  previewCopy,
  sessionDate,
  validatePreview,
  type SessionPreview,
} from "../src/lib/invitation-preview";

const token = "ab".repeat(32);
const session: SessionPreview = {
  kind: "session",
  title: "Saturday open mat",
  starts_at: "2026-11-07T18:00:00Z",
  timezone: "America/Los_Angeles",
  venue: "Alliance Jiu-Jitsu",
  participants: ["Sarah", "Kenji", "Dani"],
  participant_count: 5,
  focus: ["Knee cut", "Back takes"],
};
const env = {
  MAT_MONKEY_SUPABASE_URL: "https://example.supabase.co",
  MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
};
const active = { state: "active" as const, preview: session };

describe("Session preview content", () => {
  test("uses the session timezone, confirmed names, and top-level focus", () => {
    expect(sessionDate(session)).toMatchObject({
      day: "SAT",
      number: "7",
      month: "November",
      time: "10:00 AM",
      zone: "PST",
    });
    expect(participantSummary(session)).toBe("Sarah, Kenji, Dani + 2 more");
    expect(previewCopy("session", session).description).toContain(
      "Working on Knee cut & Back takes",
    );
    expect(sessionDate({ ...session, starts_at: "2026-11-08T02:00:00Z" }).number).toBe("7");
  });
  test("projects approved fields and rejects invalid upstream data", () => {
    expect(validatePreview({ ...session, note: "Private", ids: ["secret"] }, "session")).toEqual(
      session,
    );
    expect(validatePreview({ ...session, timezone: "Not/AZone" }, "session")).toBeNull();
    expect(validatePreview({ ...session, participant_count: 1 }, "session")).toBeNull();
    expect(validatePreview({ ...session, focus: [123] }, "session")).toBeNull();
    expect(validatePreview({ ...session, starts_at: "not-a-date" }, "session")).toBeNull();
    expect(validatePreview({ kind: "goal", title: "Private goal" }, "goal")).toEqual({
      kind: "goal",
    });
  });
});

describe("Read-only lookup", () => {
  test("managed hosting has bundled public defaults when bindings are absent", () => {
    const configured = deploymentPreviewEnvironment(new Request("https://example.com"));
    expect(configured.MAT_MONKEY_SUPABASE_URL).toBe("https://cmiqavyrazypmulrfezj.supabase.co");
    expect(configured.MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY?.startsWith("sb_publishable_")).toBe(
      true,
    );
    expect(deploymentPreviewEnvironment(new Request("https://example.com"), env)).toEqual(env);
  });
  test("uses request-scoped Nitro bindings and direct Worker bindings", () => {
    const request = new Request("https://example.com");
    Object.assign(request, { runtime: { cloudflare: { env } } });
    expect(previewEnvironment(request)).toEqual(env);
    expect(previewEnvironment(new Request("https://example.com"), env)).toEqual(env);
    expect(previewEnvironment(new Request("https://example.com"))).toEqual({
      MAT_MONKEY_SUPABASE_URL: undefined,
      MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY: undefined,
    });
  });
  test("calls only the preview RPC without user auth or redemption", async () => {
    let calls = 0;
    const fetcher = (async (url: URL, options: RequestInit) => {
      calls++;
      expect(url.pathname).toBe("/rest/v1/rpc/invitation_preview");
      expect(JSON.parse(options.body as string)).toEqual({ link_kind: "session", token });
      expect(new Headers(options.headers).get("apikey")).toBe("sb_publishable_example");
      expect(new Headers(options.headers).has("authorization")).toBe(false);
      expect(options.redirect).toBe("manual");
      return Response.json(session);
    }) as typeof fetch;
    expect(await lookupInvitation("session", token.toUpperCase(), env, fetcher)).toEqual(active);
    expect(calls).toBe(1);
  });
  test("distinguishes unavailable links from temporary failures, with no lookup for malformed tokens", async () => {
    const never = (() => {
      throw new Error("Should not fetch");
    }) as typeof fetch;
    expect(await lookupInvitation("session", "broken", env, never)).toEqual({
      state: "unavailable",
    });
    expect(await lookupInvitation("session", token, {}, never)).toEqual({ state: "offline" });
    expect(
      await lookupInvitation("session", token, env, (async () =>
        Response.json(null)) as typeof fetch),
    ).toEqual({ state: "unavailable" });
    expect(
      await lookupInvitation(
        "session",
        token,
        env,
        (async () => new Response("error", { status: 500 })) as typeof fetch,
      ),
    ).toEqual({ state: "offline" });
    expect(await lookupInvitation("session", token, env, never)).toEqual({ state: "offline" });
  });
});

describe("Crawler HTML and app fallback", () => {
  test("initial HTML includes full metadata, PNG dimensions and exact native destination without JavaScript", () => {
    const html = invitationHTML("session", token, active);
    for (const content of [
      session.title,
      session.venue,
      "Sarah, Kenji, Dani + 2 more",
      "Knee cut",
      "Back takes",
      "og:title",
      "og:description",
      "summary_large_image",
      'content="1200"',
      'content="630"',
      `matmind://session/${token}`,
    ])
      expect(html).toContain(content);
    expect(html).toContain(`/share/preview/session/${token}.png`);
    expect(html).toContain("app-id=6767997652");
    expect(html).toContain("Return to this original link after installing");
    expect(html).not.toContain("<script");
  });
  test("share URLs use the current matmonkey host, never the dead matmindbjj host", async () => {
    const host = "https://matmonkey.lovable.app";
    expect(APP_LINK_ORIGIN).toBe(host);
    const pages = [
      invitationHTML("session", token, active),
      await (await shareResponse(
        new Request(`https://example.com/session/${"0".repeat(64)}`),
        {},
        { lookup: async () => ({ state: "unavailable" as const }) },
      ))!.text(),
    ];
    for (const html of pages) {
      expect(html).not.toContain("matmindbjj");
      const tag = (re: RegExp) => html.match(re)?.[1];
      expect(tag(/property="og:url" content="([^"]+)"/)).toStartWith(`${host}/session/`);
      expect(tag(/rel="canonical" href="([^"]+)"/)).toStartWith(`${host}/session/`);
      expect(tag(/property="og:image" content="([^"]+)"/)).toStartWith(`${host}/share/preview/`);
      expect(tag(/name="twitter:image" content="([^"]+)"/)).toStartWith(`${host}/share/preview/`);
    }
    expect(pages[0]).toContain(`${host}/share/preview/session/${token}.png`);
  });
  test("download button links to the App Store listing while deep linking stays native", () => {
    const html = invitationHTML("session", token, active);
    expect(html).toContain(
      '<a class="button secondary" href="https://apps.apple.com/us/app/mat-monkey/id6767997652" rel="noreferrer">Download on the App Store</a>',
    );
    expect(html).toContain('<a class="button primary" href="matmind://session/' + token + '">');
    const noApp = invitationHTML("session", token, { state: "unavailable" });
    expect(noApp).toContain(
      'class="button primary" href="https://apps.apple.com/us/app/mat-monkey/id6767997652"',
    );
  });
  test("escapes content in visible HTML and metadata", () => {
    const html = invitationHTML("session", token, {
      ...active,
      preview: {
        ...session,
        title: '<script>alert("x")</script>',
        venue: 'Gym" onerror="alert(1)',
        participants: ["<img src=x onerror=alert(1)>"],
        participant_count: 1,
      },
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Gym&quot; onerror=&quot;alert(1)");
  });
  test("returns unavailable and offline fallbacks without inventing session data", async () => {
    for (const state of ["unavailable", "offline"] as const) {
      const response = await shareResponse(
        new Request(`https://example.com/session/${token}`),
        {},
        { lookup: async () => ({ state }) },
      );
      expect(response!.status).toBe(state === "unavailable" ? 404 : 503);
      const html = await response!.text();
      expect(html).not.toContain("Saturday open mat");
      expect(html).not.toContain("Alliance Jiu-Jitsu");
      expect(html.includes(`matmind://session/${token}`)).toBe(state === "offline");
    }
  });
  test("supports all link kinds, HEAD, image responses, methods and privacy headers", async () => {
    for (const kind of ["friend", "session", "goal"] as const) {
      const lookup = async () => ({
        state: "active" as const,
        preview: kind === "session" ? session : { kind },
      });
      const request = new Request(`https://example.com/${kind}/${token}`);
      const response = (await shareResponse(request, {}, { lookup }))!;
      expect(response.status).toBe(200);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(response.headers.get("referrer-policy")).toBe("no-referrer");
      expect(response.headers.get("content-security-policy")).toContain("default-src 'none'");
      expect(await response.text()).toContain(`matmind://${kind}/${token}`);
      const head = (await shareResponse(new Request(request, { method: "HEAD" }), {}, { lookup }))!;
      expect(await head.text()).toBe("");
      const post = (await shareResponse(new Request(request, { method: "POST" }), {}, { lookup }))!;
      expect(post.status).toBe(405);
      const image = (await shareResponse(
        new Request(`https://example.com/share/preview/${kind}/${token}.png`),
        {},
        {
          lookup,
          image: async () => new Response("png", { headers: { "Content-Type": "image/png" } }),
        },
      ))!;
      expect(image.headers.get("content-type")).toBe("image/png");
      expect(image.headers.get("cache-control")).toBe("no-store");
      expect(await image.text()).toBe("png");
    }
  });
  test("leaves unrelated website routes to the existing router", async () => {
    for (const path of ["/", "/privacy", "/friendship"])
      expect(await shareResponse(new Request(`https://example.com${path}`), {})).toBeNull();
  });
});
