import { ImageResponse } from "workers-og";
import displayFont from "./share-assets/BricolageGrotesque-ExtraBold.ttf?inline";
import bodyFont from "./share-assets/Archivo-Regular.ttf?inline";
import { ShareCard } from "./share-card";
import type { InvitationKind } from "./app-links";
import type { InvitationPreview } from "./invitation-preview";

function fontBuffer(dataURL: string): ArrayBuffer {
  const binary = atob(dataURL.slice(dataURL.indexOf(",") + 1));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0)).buffer;
}
const fonts = [
  {
    name: "Bricolage",
    data: fontBuffer(displayFont),
    weight: 800 as const,
    style: "normal" as const,
  },
  { name: "Archivo", data: fontBuffer(bodyFont), weight: 400 as const, style: "normal" as const },
];

export async function shareImage(
  kind: InvitationKind | "app",
  preview?: InvitationPreview,
): Promise<Response> {
  const image = new ImageResponse(<ShareCard kind={kind} preview={preview} />, {
    width: 1200,
    height: 630,
    fonts,
  });
  // Consume inside the handler so WASM/render errors are caught before headers.
  return new Response(await image.arrayBuffer(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": kind === "app" ? "public, max-age=3600" : "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
