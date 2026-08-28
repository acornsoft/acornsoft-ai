import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { VoiceOpenDock } from "@/components/site/voice-access";
import { bootstrapAnalytics } from "@/lib/analytics/client";
import appCss from "../styles.css?url";

const inbioCss = [
  "/inbio/assets/css/vendor/bootstrap.min.css",
  "/inbio/assets/css/vendor/slick.css",
  "/inbio/assets/css/vendor/slick-theme.css",
  "/inbio/assets/css/vendor/aos.css",
  "/inbio/assets/css/plugins/feature.css",
  "/inbio/assets/css/style.css",
  "/inbio/acornsoft-overrides.css?v=type-source-10",
] as const;

/** Public host for absolute share-card URLs. Omit tags when unknown. */
function shareHost(): string | undefined {
  if (typeof process === "undefined") return undefined;
  const raw = (
    process.env.VERCEL_URL ||
    process.env.BETTER_AUTH_URL ||
    ""
  ).trim();
  const host = raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return host || undefined;
}

export const Route = createRootRouteWithContext()({
  head: () => {
    const host = shareHost();
    const ogImage = host ? `https://${host}/og.jpg` : undefined;
    const xBanner = host ? `https://${host}/x-banner.jpg` : undefined;
    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title:
            "Acornsoft — Climb Notes™, the crossover from non-technical to technical",
        },
        {
          name: "description",
          content:
            "Climb Notes™ are the crossover: the same four moves for someone who does not write code and someone who does. Gnomah is our second brain. Grok-based tools — this is the way.",
        },

        { name: "theme-color", content: "#502000" },
        { property: "og:title", content: "Acornsoft" },
        {
          property: "og:description",
          content:
            "Climb Notes™ are the crossover from non-technical to technical. Gnomah is our second brain. Grok-based tools — this is the way.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(ogImage
          ? [
              { property: "og:image", content: ogImage },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { name: "twitter:image", content: ogImage },
            ]
          : []),
        ...(xBanner
          ? [{ property: "x:game:image", content: xBanner }]
          : []),
      ],
      links: [
        { rel: "icon", href: "/favicon.png", type: "image/png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        { rel: "stylesheet", href: appCss },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&display=swap",
        },
        ...inbioCss.map((href) => ({ rel: "stylesheet" as const, href })),
      ],
    };
  },
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  useEffect(() => {
    bootstrapAnalytics();
  }, []);

  return (
    <AuthProvider>
      <Outlet />
      <VoiceOpenDock />
      <ScrollToTop />
    </AuthProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="template-color-1 spybody ac-has-global-hero ac-hero-static">
        {/* Shared still photo — no Ken Burns / breathe. Flicker came from that loop. */}
        <div className="ac-global-hero" aria-hidden="true">
          <div className="ac-global-hero-photo" />
          <div className="ac-global-hero-wash" />
        </div>
        {children}
        <Toaster position="top-center" richColors />
        <Scripts />
      </body>
    </html>
  );
}
