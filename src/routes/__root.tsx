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
import { bootstrapAnalytics } from "@/lib/analytics/client";
import appCss from "../styles.css?url";

const inbioCss = [
  "/inbio/assets/css/vendor/bootstrap.min.css",
  "/inbio/assets/css/vendor/slick.css",
  "/inbio/assets/css/vendor/slick-theme.css",
  "/inbio/assets/css/vendor/aos.css",
  "/inbio/assets/css/plugins/feature.css",
  "/inbio/assets/css/style.css",
  "/inbio/acornsoft-overrides.css?v=type-source-1",
] as const;

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title:
          "Acornsoft — Building Production AI Solutions via Climb Notes",
      },
      {
        name: "description",
        content:
          "Acornsoft is a New York–based AI-first organization. Building Production AI Solutions via Climb Notes—on Grok Build, Imagine, Voice, Agents, Skills, and Connectors.",
      },

      { name: "theme-color", content: "#502000" },
      { property: "og:title", content: "Acornsoft" },
      {
        property: "og:description",
        content:
          "New York–based AI-first organization. Building Production AI Solutions via Climb Notes.",

      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
        href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap",
      },
      ...inbioCss.map((href) => ({ rel: "stylesheet" as const, href })),
    ],
  }),
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
