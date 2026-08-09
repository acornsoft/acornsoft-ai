import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import appCss from "../styles.css?url";

const inbioCss = [
  "/inbio/assets/css/vendor/bootstrap.min.css",
  "/inbio/assets/css/vendor/slick.css",
  "/inbio/assets/css/vendor/slick-theme.css",
  "/inbio/assets/css/vendor/aos.css",
  "/inbio/assets/css/plugins/feature.css",
  "/inbio/assets/css/style.css",
  "/inbio/acornsoft-overrides.css?v=service-metaphor-assist-1",
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
      <body className="template-color-1 spybody ac-has-global-hero">
        {/* Single shared hero stage — same image + animation phase on every route */}
        <div className="ac-global-hero" aria-hidden="true">
          <div className="ac-global-hero-photo" />
          <div className="ac-global-hero-wash" />
        </div>
        {/*
          Hero breathe runs sitewide (root layer). Pause when motion is reduced,
          Save-Data is on, or the network is slow / high-latency.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var b=document.body;
  if(!b)return;
  function pause(reason){
    b.classList.add("ac-hero-static");
    if(reason)b.setAttribute("data-hero-static",reason);
  }
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    pause("reduced-motion");return;
  }
  if(window.matchMedia("(prefers-reduced-data: reduce)").matches){
    pause("reduced-data");return;
  }
  var c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  if(c){
    if(c.saveData){pause("save-data");return;}
    var t=String(c.effectiveType||"");
    if(t==="slow-2g"||t==="2g"){pause("slow-network");return;}
    if(typeof c.downlink==="number"&&c.downlink>0&&c.downlink<1.5){
      pause("low-bandwidth");return;
    }
    /* High RTT = high latency — skip animation to keep the main thread free */
    if(typeof c.rtt==="number"&&c.rtt>=400){pause("high-latency");return;}
  }
}catch(e){}})();`,
          }}
        />
        {children}
        <Toaster position="top-center" richColors />
        <Scripts />
      </body>
    </html>
  );
}
