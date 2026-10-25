import { SiteChrome } from "./site-chrome";

/**
 * The only Bookshelf copy on the page. Fill these four strings in this
 * constant. Leave the placeholder text until real public copy exists.
 */
export const BOOKSHELF_COPY = {
  whatItIs: "[COPY SLOT — David to supply: What it is]",
  whoItsFor: "[COPY SLOT — David to supply: Who it's for]",
  whatItDoes: "[COPY SLOT — David to supply: What it does]",
  howYouStart: "[COPY SLOT — David to supply: How you start]",
} as const;

const BOOKSHELF_PARTS = [
  { id: "bs-what", label: "What it is", text: BOOKSHELF_COPY.whatItIs },
  { id: "bs-who", label: "Who it's for", text: BOOKSHELF_COPY.whoItsFor },
  { id: "bs-does", label: "What it does", text: BOOKSHELF_COPY.whatItDoes },
  { id: "bs-start", label: "How you start", text: BOOKSHELF_COPY.howYouStart },
] as const;

/** Public Bookshelf page. Direct URL only. No product copy beyond the slots. */
export function BookshelfPage() {
  return (
    <SiteChrome loginRedirect="/bookshelf" mainClassName="bs-page">
      <div className="ac-service-page bs-page ac-page-top">
        <div className="bs-stack">
          <header className="bs-panel bs-hero bs-rise">
            <p className="bs-kicker">Product</p>
            <h1 className="bs-title">Bookshelf</h1>
            <span className="bs-rule" aria-hidden="true" />
          </header>

          <section className="bs-section bs-rise" aria-labelledby="bs-explain-title">
            <div className="bs-section-head">
              <p className="bs-kicker">Product explanation</p>
              <h2 id="bs-explain-title" className="bs-heading">
                What it is · Who it&apos;s for · What it does · How you start
              </h2>
            </div>
            <div className="bs-explain">
              {BOOKSHELF_PARTS.map((part) => (
                <section key={part.id} className="bs-panel bs-part" aria-labelledby={part.id}>
                  {"\n"}
                  <h3 id={part.id} className="bs-part-label">
                    {part.label}
                  </h3>
                  {"\n"}
                  <p className="bs-slot">
                    {"\n"}
                    {part.text}
                    {"\n"}
                  </p>
                  {"\n"}
                </section>
              ))}
            </div>
          </section>
        </div>
      </div>
    </SiteChrome>
  );
}
