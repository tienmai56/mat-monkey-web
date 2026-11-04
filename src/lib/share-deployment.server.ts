import { previewEnvironment, type PreviewEnvironment } from "./invitation-preview";

// Public API coordinates for the same social project as the iOS app. Some
// managed hosts do not forward wrangler.vars into the custom SSR entry. These
// bundled, server-only defaults keep the approved preview RPC reachable there.
// This is a publishable key; database RLS and the bearer invitation still apply.
const productionPreview: Required<PreviewEnvironment> = {
  MAT_MONKEY_SUPABASE_URL: "https://cmiqavyrazypmulrfezj.supabase.co",
  MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_hKIKCsvvByRHW4XcRyJfXw_SCoijPdr",
};

export function deploymentPreviewEnvironment(
  request: Request,
  bindings?: unknown,
): PreviewEnvironment {
  const runtime = previewEnvironment(request, bindings);
  const node = typeof process === "undefined" ? {} : process.env;
  return {
    MAT_MONKEY_SUPABASE_URL:
      runtime.MAT_MONKEY_SUPABASE_URL ||
      node.MAT_MONKEY_SUPABASE_URL ||
      productionPreview.MAT_MONKEY_SUPABASE_URL,
    MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY:
      runtime.MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY ||
      node.MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY ||
      productionPreview.MAT_MONKEY_SUPABASE_PUBLISHABLE_KEY,
  };
}
