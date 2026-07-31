import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const inbioCss = [
  "/inbio/assets/css/vendor/bootstrap.min.css",
  "/inbio/assets/css/vendor/slick.css",
  "/inbio/assets/css/vendor/slick-theme.css",
  "/inbio/assets/css/vendor/aos.css",
  "/inbio/assets/css/plugins/feature.css",
  "/inbio/assets/css/style.css",
  "/inbio/acornsoft-overrides.css",
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
          "Acornsoft: Building Production AI Solutions via Climb Notes—on Grok Build, Imagine, Voice, Agents, Skills, and Connectors.",
      },
      { name: "theme-color", content: "#502000" },
      { property: "og:title", content: "Acornsoft" },
      {
        property: "og:description",
        content:
          "Building Production AI Solutions via Climb Notes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap",
      },
      ...inbioCss.map((href) => ({ rel: "stylesheet" as const, href })),
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  return <Outlet />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="template-color-1 spybody">
        {children}
        <Toaster position="top-center" richColors />
        <Scripts />
      </body>
    </html>
  );
}
