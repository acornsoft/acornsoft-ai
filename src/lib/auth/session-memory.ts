/**
 * Auth UI memory that survives header remounts.
 *
 * SiteHeader lives inside each page (not the root layout), so every navigation
 * unmounts it. A React ref dies with that unmount and the chrome blinks:
 * Voice, Method, Gnomah, the account chip, the settings gear.
 *
 * Cleared only on explicit sign-out. A background get-session miss is not logout.
 */
export const sessionMemory: {
  user: {
    id: string;
    displayName: string | null;
    primaryEmail: string | null;
    profileImageUrl: string | null;
    isDevFallback: boolean;
  } | null;
  voice: { userId: string; allowed: boolean } | null;
} = {
  user: null,
  voice: null,
};

export function clearSessionMemory() {
  sessionMemory.user = null;
  sessionMemory.voice = null;
}
