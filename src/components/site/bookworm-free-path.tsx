import {
  BOOKWORM_FREE_PATH_COPY,
  BOOKWORM_STARTER,
  type BookwormStarter,
} from "./bookworm-starter";

/**
 * Free path sits next to the Grok Bot template way in.
 * Renders nothing unless the starter repo is public.
 */
export function BookwormFreePath({ starter = BOOKWORM_STARTER }: { starter?: BookwormStarter }) {
  if (!starter.isPublic) return null;

  return (
    <section className="bw-section bw-rise bw-free" aria-labelledby="bw-free-title">
      <div className="bw-section-head">
        <p className="bw-kicker">{BOOKWORM_FREE_PATH_COPY.kicker}</p>
        <h2 id="bw-free-title" className="bw-heading">
          {BOOKWORM_FREE_PATH_COPY.heading}
        </h2>
      </div>
      <div className="bw-panel bw-get">
        <p className="bw-copy bw-copy-lead">{BOOKWORM_FREE_PATH_COPY.body}</p>
        <p className="bw-source">
          <a href={starter.url} rel="noopener noreferrer">
            {BOOKWORM_FREE_PATH_COPY.linkLabel}
          </a>
        </p>
      </div>
    </section>
  );
}
