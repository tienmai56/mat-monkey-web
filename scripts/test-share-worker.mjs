import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

// Run after `bun run build`. The fixture entry is written only to ignored build
// output: production source never accepts fixture flags or bypasses the RPC.
const output = resolve(process.argv[2] ?? "/tmp/matmonkey-share-worker-tests");
await mkdir(output, { recursive: true });
const configPath = resolve(".output/server/wrangler.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
const fixture = {
  kind: "session",
  title: "Saturday open mat",
  starts_at: "2026-11-07T18:00:00Z",
  timezone: "America/Los_Angeles",
  venue: "Alliance Jiu-Jitsu",
  participants: ["Sarah", "Kenji", "Dani"],
  participant_count: 3,
  focus: ["Knee cut", "Back takes"],
};
await writeFile(
  resolve(".output/server/share-test-worker.mjs"),
  `
import server from './index.mjs';
const fixture=${JSON.stringify(fixture)};
const originalFetch=globalThis.fetch;
globalThis.fetch=async(input,options)=>{
  const url=new URL(typeof input==='string'?input:input.url??input.href);
  if(url.hostname!=='share-fixture.invalid')return originalFetch(input,options);
  if(url.pathname!=='/rest/v1/rpc/invitation_preview'||options.method!=='POST')throw new Error('Unexpected backend operation');
  const {link_kind,token}=JSON.parse(options.body);
  if(token==='d'.repeat(64))return Response.json(null);
  if(token==='e'.repeat(64))return Response.json({kind:'wrong'});
  if(token==='f'.repeat(64))return new Response(null,{status:503});
  if(link_kind!=='session')return Response.json({kind:link_kind});
  if(token==='b'.repeat(64))return Response.json({...fixture,title:'A very long training session title with guard retention, passing, back escapes and plenty of rounds for the entire team',venue:'A very long academy location name in San Francisco, California, United States',participants:['Alexandria Montgomery-Williams','Christopher Johnson-Smith','Dani'],participant_count:12,focus:['Knee-cut passing from half guard','Retention and shoulder framing','Escaping from back control']});
  if(token==='c'.repeat(64))return Response.json({...fixture,title:'Open mat',participants:[],participant_count:0,focus:[]});
  return Response.json(fixture);
};
export default {fetch(request,env,ctx){return server.fetch(request,{...env,MAT_MONKEY_SUPABASE_URL:'https://share-fixture.invalid',MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture'},ctx)}};
`,
);
config.main = "share-test-worker.mjs";
config.name = "matmonkey-share-fixture";
const testConfig = resolve(".output/server/wrangler.share-test.json");
await writeFile(testConfig, JSON.stringify(config));
const log = await import("node:fs").then((fs) => fs.openSync(resolve(output, "worker.log"), "w"));
const worker = spawn(
  resolve("node_modules/.bin/wrangler"),
  ["dev", "--config", testConfig, "--local", "--ip", "127.0.0.1", "--port", "4186"],
  { stdio: ["ignore", log, log] },
);
const base = "http://127.0.0.1:4186";
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (worker.exitCode !== null) throw new Error("Fixture worker exited before readiness");
    try {
      const response = await fetch(base + "/.well-known/apple-app-site-association");
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* startup */
    }
    await pause(200);
  }
  assert(ready, "Fixture worker did not become ready");
  for (const kind of ["session", "friend", "goal"]) {
    const token = "a".repeat(64);
    const response = await fetch(`${base}/${kind}/${token}`, {
      headers: { "user-agent": "facebookexternalhit/1.1" },
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    const html = await response.text();
    assert(html.includes(`matmind://${kind}/${token}`));
    const canonical = `https://mymatmonkey.com/${kind}/${token}`;
    const imageURL = `https://mymatmonkey.com/share/preview/${kind}/${token}.png`;
    assert(html.includes(`property="og:url" content="${canonical}"`));
    assert(html.includes(`rel="canonical" href="${canonical}"`));
    assert(html.includes(`property="og:image" content="${imageURL}"`));
    assert(html.includes(`name="twitter:image" content="${imageURL}"`));
    assert(!html.includes("lovable.app"));
    assert(html.includes("summary_large_image"));
    assert(!html.includes("<script"));
    if (kind === "session") {
      for (const value of [
        "Saturday open mat",
        "Alliance Jiu-Jitsu",
        "Sarah, Kenji, Dani",
        "Knee cut",
        "Back takes",
        "10:00 AM PST",
      ])
        assert(html.includes(value), value);
      await writeFile(resolve(output, "session.html"), html);
    }
    const png = await fetch(`${base}/share/preview/${kind}/${token}.png`);
    assert.equal(png.status, 200);
    assert.equal(png.headers.get("content-type"), "image/png");
    assert.equal(png.headers.get("cache-control"), "no-store");
    const bytes = Buffer.from(await png.arrayBuffer());
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1200);
    assert.equal(bytes.readUInt32BE(20), 630);
    await writeFile(resolve(output, `${kind}.png`), bytes);
  }
  for (const [token, name] of [
    ["b", "long-session"],
    ["c", "empty-focus"],
  ]) {
    const response = await fetch(`${base}/share/preview/session/${token.repeat(64)}.png`);
    assert.equal(response.status, 200);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    await writeFile(resolve(output, `${name}.png`), bytes);
  }
  for (const [token, status] of [
    ["d", 404],
    ["e", 503],
    ["f", 503],
  ]) {
    for (const path of [
      `/session/${token.repeat(64)}`,
      `/share/preview/session/${token.repeat(64)}.png`,
    ]) {
      const response = await fetch(base + path);
      assert.equal(response.status, status);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert(!(await response.text()).includes("Saturday open mat"));
    }
  }
  assert.equal((await fetch(`${base}/session/${"a".repeat(64)}`, { method: "POST" })).status, 405);
  const head = await fetch(`${base}/share/preview/session/${"a".repeat(64)}.png`, {
    method: "HEAD",
  });
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  console.log(`Built Cloudflare worker checks passed. Rendered cards: ${output}`);
} finally {
  worker.kill("SIGTERM");
}
