# Rich invitation links

Sharing a training session produces a Paper 3 / Coral 500 ticket with its title,
date/time and timezone, gym, up to three confirmed participants (plus a remaining
count), and up to three top-level focus names. Full notes and nested focus details
stay inside the app. Friend and goal links use generic branded cards. Other pages
inherit the branded app card from the root metadata.

## Routes and behavior

- `/.well-known/apple-app-site-association`: extensionless JSON for the configured
  app ID, covering `/friend/*`, `/session/*`, and `/goal/*`. No redirect.
- `/{friend|session|goal}/<token>`: complete Open Graph and Twitter card metadata in
  the initial server response, followed by a responsive, script-free summary and
  **Open in Mat Monkey** / App Store actions.
- `/share/preview/{friend|session|goal}/<token>.png`: actual 1200 × 630 PNG generated
  on Cloudflare Workers using bundled brand fonts and artwork. No remote fonts,
  browser rendering service, client JavaScript, or service-role key is needed.
- `/share/preview/app.png`: generic brand image for the homepage and other routes.

Invitation pages and images use `no-store`, `noindex, nofollow`, `no-referrer`, and
`nosniff`. Invalid, expired, revoked, cancelled, or unavailable invitations return
404 without session content. Temporary backend/configuration errors return 503;
the HTML still offers the native-app button for a structurally valid token.
Preview requests never redeem a token, change RSVP, or create an invitation.

The custom server entry handles these routes before TanStack SSR. This avoids
inherited homepage OG tags, deferred client loaders, and hydration requirements.
The rest of the website still uses the existing router. The homepage's visible
content and privacy page are not redesigned.

## Backend configuration

First apply `20261104160002_invitation_previews.sql` from **Calculated-Reps** to the
iOS/social Supabase project. It adds the deliberately anonymous, read-only
`invitation_preview(link_kind, token)` RPC. The complete active bearer token is its
authorization. Existing tables retain their RLS and anonymous access restrictions.
The token hash lookup uses the existing unique index.

Set these **runtime bindings** in Lovable/Cloudflare:

```text
MAT_MONKEY_SUPABASE_URL=https://cmiqavyrazypmulrfezj.supabase.co
MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY=<that project's publishable or legacy anon key>
```

Do not reuse the landing site's unrelated `VITE_SUPABASE_*` values. Never configure
a service-role key. For local development use an untracked `.dev.vars`. Database
notes are decoded and filtered inside the RPC, so even the server response only
contains the approved preview fields. Only `going` participants are shown;
invited, declined, and organizer-blocked people are excluded.

## Publish and verify

1. Apply the reviewed database migration to the social project and configure the
   runtime bindings above.
2. Confirm `9R4A2F8F94.com.tienmai.intentionaltrainingnotes` against the production
   provisioning profile. Retain `applinks:matmindbjj.lovable.app` in iOS entitlements.
3. Merge and publish this website through its existing Lovable workflow. GitHub
   merge alone does not publish the website.
4. Verify the live association URL returns JSON with no redirect and that a genuine
   session token returns its own metadata and a valid PNG, using
   `SESSION_SHARE_TOKEN=<active token> node scripts/verify-share-host.mjs` in the
   iOS repository. Do not publish a fixture or sample token.
5. On a physical iPhone, verify installed/uninstalled behavior, Messenger's in-app
   browser fallback, profile setup/sign-in continuation, exact session navigation,
   expired links, and cancellation. After installation users return to the original
   invitation; this does not implement deferred linking across installation.
6. Set **AppLinksEnabled=true** in iOS Info.plist after verification and ship the
   signed build. The checked-in flag remains false until hosting is ready, so
   existing installed builds continue creating custom-scheme links in the meantime.

Messaging apps control their card crops, description truncation, and caches.
Saved session changes affect subsequent server requests, but a cached social card
may not refresh immediately. A withdrawn card cannot erase details already seen
by a recipient. Sharing the summary is intentional under the approved design.

## Checks

```sh
bun install --frozen-lockfile --ignore-scripts
bun run test:links
bunx --no-install tsc --noEmit
bun run build
bun run test:share:worker
```

`test:share:worker` launches a local fixture entry around the built Cloudflare
worker. It renders real PNGs for all invitation types, checks long titles and
empty focuses, verifies crawler HTML/native destinations/privacy headers, and
checks unavailable and temporary-error responses. Fixture code is generated only
inside ignored build output and never adds a fixture switch to production code.

The database suite in Calculated-Reps tests the real RPC, including privilege
boundaries, content filtering, expiry/revocation, cancellation, and no RSVP writes.
Native XCTest still requires Xcode on macOS.

The existing website privacy policy describes the older local-only release. Review
it against the social app before shipping v2; this feature does not rewrite it.
