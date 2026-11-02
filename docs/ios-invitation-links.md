# iOS invitation links

This change adds only the link endpoints and fallback pages for the Mat Mind iOS revamp. The existing homepage and privacy page content remain unchanged.

## Routes

- `GET /.well-known/apple-app-site-association`: extensionless JSON response with no redirect. The existing custom server entry serves this before SSR; GET/HEAD are supported and other methods receive 405.
- `/friend/<token>`: open a friendship invitation in the installed app, or install from the App Store.
- `/session/<token>`: open a training invitation in the installed app, or install from the App Store.

The pages require a complete 64-character hexadecimal token before offering an app link. They do not redeem tokens, fetch session or account details, or add client analytics/token storage. Native authentication and backend authorization decide whether an invitation is valid. No training archive data is involved.

Invitation responses have `Referrer-Policy: no-referrer`, `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`. They provide an explicit `matmind://` button and the App Store URL for app ID `6767997652`. After installing, users must return to the original link; there is no cross-install deferred deep linking.

## Publish and verify

1. Confirm the AASA application identifier `9R4A2F8F94.com.tienmai.intentionaltrainingnotes` against the App Identifier Prefix and bundle ID in the production provisioning profile. The prefix comes from the configured development team in the iOS repository.
2. Merge the reviewed change and publish it through the existing Lovable workflow. A preview build or GitHub merge is not proof that the production site has been republished.
3. Verify `https://matmindbjj.lovable.app/.well-known/apple-app-site-association` returns HTTP 200 with JSON and no redirect; verify both invitation paths return the fallback pages.
4. In the iOS project, retain `applinks:matmindbjj.lovable.app` in Associated Domains and regenerate the signing profile as needed. Install a signed build and test genuine server-issued links on a physical device, including expired tokens and sign-in continuation.
5. Only after successful verification set `AppLinksEnabled` to true in the iOS Info.plist. The iOS project currently keeps this false to avoid distributing HTTPS links before hosting is ready.

The existing privacy page describes the currently released local-only app. Review it against the new social/backend behavior before releasing v2; this link change does not rewrite that policy.

## Checks

```sh
bun install --frozen-lockfile --ignore-scripts
bun run test:links
bun run build
bunx --no-install tsc --noEmit
```

The six focused tests cover association JSON/MIME/methods, token validation, correct app/install destinations, privacy headers, and isolation from the homepage/privacy responses. Also inspect the production build via `bun run preview` and request the actual HTTP endpoints before publication.
