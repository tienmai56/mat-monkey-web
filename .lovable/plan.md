# Deployment check: invitation preview bindings (read-only findings)

## Findings
1. **Bindings present?** No. The project's only configured secret is the managed `LOVABLE_API_KEY`. `MAT_MONKEY_SUPABASE_URL` and `MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY` are both absent.
2. **Effect if published as-is:** `lookupInvitation` returns `offline`, so `/session|friend|goal/<token>` pages respond 503 (native-app button still shown). The association file and generic app card are unaffected.
3. **Can existing settings supply them without a GitHub PR?** Yes, in principle: Project Settings → Secrets is the supported place, needs no code change or PR, and a new value reaches the published app at the next publish. Not verified: whether Lovable exposes secrets as Worker `env` bindings (which `previewEnvironment` reads from the fetch `env` argument / `request.runtime.cloudflare.env`) versus only `process.env`. If only `process.env`, the current code would not see them and a code change (therefore a PR) would be needed. This should be confirmed in the preview after adding the secrets, before publishing.
4. **URL preserved?** Yes. The project is published, public, and `matmindbjj.lovable.app` is both the published and primary URL; no custom domain. Republishing without a slug change keeps it.

## Proposed next steps (only on your go-ahead; nothing done yet)
- You add both values in Project Settings → Secrets (the publishable key only, never service-role).
- Verify in the preview that a real token page returns 200 with session metadata. If it still shows 503, stop: the fix needs a code change, which must go through the pending PR approval, not be bypassed.
- Publish only after you explicitly ask.
