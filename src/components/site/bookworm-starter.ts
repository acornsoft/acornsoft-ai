/**
 * Public starter repo for the Bookworm free path.
 * isPublic stays false until that repo exists and is public.
 * The free-path section renders only when isPublic is true.
 */
export type BookwormStarter = {
  repo: string;
  url: string;
  isPublic: boolean;
};

export const BOOKWORM_STARTER: BookwormStarter = {
  repo: "acornsoft/bookworm-starter",
  url: "https://github.com/acornsoft/bookworm-starter",
  isPublic: false,
};

/** Visible free-path strings. Edit copy here. */
export const BOOKWORM_FREE_PATH_COPY = {
  kicker: "Free path",
  heading: "Run Bookworm free",
  body: "Bookworm can be run free from a public starter repo on GitHub.",
  linkLabel: "github.com/acornsoft/bookworm-starter",
} as const;
