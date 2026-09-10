import { SiteChrome } from "./site-chrome";

/**
 * Soft landing while Acornsoft AI is not ready to announce.
 * LinkedIn and cold traffic should land here, not on the product home.
 */
export function ComingSoonPage() {
  return (
    <SiteChrome loginRedirect="/login">
      <main className="ac-service-page ac-page-top">
        <div className="ac-service-stack" style={{ maxWidth: "42rem" }}>
          <header className="ac-service-head">
            <span className="ac-service-kicker">Acornsoft</span>
            <h1 className="ac-service-title">Coming soon</h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                We’re still getting the public site ready. Nothing to announce
                here yet.
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                Check back later. If you already work with us, sign in when you
                have an account.
              </p>
            </div>
          </header>
        </div>
      </main>
    </SiteChrome>
  );
}
