import { describe, expect, test } from "bun:test";
import {
  APP_IDENTIFIER,
  APP_STORE_URL,
  associationResponse,
  invitationAppURL,
  protectInvitationResponse,
} from "../src/lib/app-links";

describe("Apple app association", () => {
  test("GET returns extensionless association JSON without redirect", async () => {
    const response = associationResponse("GET");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.has("location")).toBe(false);
    const data = await response.json();
    expect(data.applinks.details[0].appIDs).toEqual([APP_IDENTIFIER]);
    expect(data.applinks.details[0].components).toEqual([
      { "/": "/friend/*" },
      { "/": "/session/*" },
    ]);
  });
  test("HEAD has JSON headers and no body; writes are rejected", async () => {
    expect(await associationResponse("HEAD").text()).toBe("");
    expect(associationResponse("HEAD").headers.get("content-type")).toContain("application/json");
    expect(associationResponse("POST").status).toBe(405);
  });
});

describe("Invitation destinations", () => {
  test("preserves tokens for both kinds and uses the actual App Store listing", () => {
    const token = "a1".repeat(32);
    expect(invitationAppURL("friend", token)).toBe(`matmind://friend/${token}`);
    expect(invitationAppURL("session", token)).toBe(`matmind://session/${token}`);
    expect(APP_STORE_URL).toContain("id6767997652");
  });
  test("rejects incomplete, extra-path and markup tokens", () => {
    for (const token of [
      "",
      "abc",
      "a".repeat(65),
      "g".repeat(64),
      "a".repeat(64) + "/extra",
      "<script>alert(1)</script>",
    ]) {
      expect(invitationAppURL("friend", token)).toBeNull();
    }
  });
});

describe("Invitation privacy headers", () => {
  test("prevents browser referrer leakage and caching while preserving body/status", async () => {
    const response = protectInvitationResponse(
      new Response("invitation", { status: 200 }),
      "/session/" + "b".repeat(64),
    );
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(await response.text()).toBe("invitation");
    expect(
      protectInvitationResponse(new Response("error", { status: 500 }), "/friend/broken").status,
    ).toBe(500);
  });
  test("leaves homepage and privacy responses unchanged", () => {
    for (const path of ["/", "/privacy", "/friendship"]) {
      const response = new Response("existing", { headers: { "cache-control": "public" } });
      expect(protectInvitationResponse(response, path)).toBe(response);
    }
  });
});
