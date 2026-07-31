/**
 * Shared privacy, proper usage, and trademark notices.
 * All third-party names remain the property of their respective owners.
 */

export function LegalNotices({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`ac-legal${compact ? " ac-legal-compact" : ""}`}>
      <section className="ac-legal-block" id="privacy" aria-labelledby="privacy-heading">
        <h3 id="privacy-heading">Privacy</h3>
        <p>
          Acornsoft respects your privacy. We do not operate email forms or phone
          queues on this site. Conversations with Acornsoft begin through Voice.
          We collect only what is needed to respond to project inquiries and to
          operate this site (for example standard server logs and analytics that
          do not sell personal data). We do not sell personal information. Do not
          send secrets, regulated health data, or credentials through public Voice
          sessions or social posts. For privacy questions, reach us via Voice and
          request a privacy follow-up.
        </p>
      </section>

      <section
        className="ac-legal-block"
        id="proper-usage"
        aria-labelledby="usage-heading"
      >
        <h3 id="usage-heading">Proper Usage</h3>
        <p>
          Use Acornsoft materials, Climb Notes, and Canopy for lawful,
          professional purposes only. Do not misrepresent Acornsoft as affiliated
          with, endorsed by, or speaking for Tesla, Incorporated; Space Exploration
          Technologies Corporation (SpaceX); X Corporation; SpaceXAI (formerly
          X.AI Corporation); or any other third party. Do not scrape, reverse
          engineer, or republish Canopy feednotes in ways that violate third-party
          platform rules (including X terms of service). Production systems built
          with Grok Build, Grok, or related tools remain your responsibility for
          safety, evaluation, access control, and compliance.
        </p>
      </section>

      <section
        className="ac-legal-block"
        id="trademarks"
        aria-labelledby="tm-heading"
      >
        <h3 id="tm-heading">Trademarks and Copyrights</h3>
        <p>
          All product and company names are trademarks or registered trademarks of
          their respective owners. Acornsoft is not affiliated with, sponsored by,
          or endorsed by those owners unless a written agreement says otherwise.
        </p>
        <ul className="ac-legal-tm-list">
          <li>
            <strong>Tesla</strong>, <strong>Optimus</strong>, and related marks are
            trademarks of Tesla, Incorporated.
          </li>
          <li>
            <strong>SpaceX</strong>, <strong>Falcon</strong>,{" "}
            <strong>Starship</strong>, <strong>Starlink</strong>, and related marks
            are trademarks of Space Exploration Technologies Corporation.
          </li>
          <li>
            <strong>X</strong> is a trademark of X Corporation (or its affiliates).
          </li>
          <li>
            <strong>Grok</strong>, <strong>Grok Build</strong>,{" "}
            <strong>SpaceXAI</strong>, <strong>xAI</strong>, and related marks are
            trademarks of SpaceXAI / X.AI Corporation (or its affiliates), used here
            only for identification and commentary.
          </li>
          <li>
            <strong>Acornsoft</strong>, <strong>Climb Notes</strong>, and{" "}
            <strong>Canopy</strong> are marks of Acornsoft.
          </li>
        </ul>
        <p className="ac-legal-disclaimer">
          Timeline entries about third-party products are curated public
          announcements for information only. They are not official statements from
          Tesla, SpaceX, X, or SpaceXAI. Verify facts on each company official
          channels before relying on them. Copyright in third-party posts, images,
          and videos remains with the original rights holders; Acornsoft does not
          claim ownership of that content.
        </p>
      </section>
    </div>
  );
}

export function LegalFooterLinks() {
  return (
    <ul className="ac-legal-footer-links">
      <li>
        <a href="/#privacy">Privacy</a>
      </li>
      <li>
        <a href="/#proper-usage">Proper Usage</a>
      </li>
      <li>
        <a href="/#trademarks">Trademarks</a>
      </li>
    </ul>
  );
}
