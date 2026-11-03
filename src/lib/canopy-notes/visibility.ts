import type { NoteKind } from "./types";

/**
 * Same rule as the SQL in `selectVisible`.
 * An allowlisted note is visible to everyone, including a revoked account.
 * Anything else is visible only when the caller is signed in, not revoked,
 * and assigned, and the note is not product or foundation.
 */
export type VisibilityFacts = {
  kind: NoteKind;
  onAllowlist: boolean;
  assignedToCaller: boolean;
  revoked: boolean;
  signedIn: boolean;
};

export function isNoteVisible(facts: VisibilityFacts): boolean {
  if (facts.onAllowlist) return true;
  if (!facts.signedIn || facts.revoked || !facts.assignedToCaller) return false;
  return facts.kind !== "product" && facts.kind !== "foundation";
}

/**
 * A missing id and a note the caller cannot see take the same path.
 * `null` is a missing id. Restore is `revoked: false` on the same facts.
 */
export function routeForLookup(facts: VisibilityFacts | null): "visible" | "not-found" {
  if (!facts || !isNoteVisible(facts)) return "not-found";
  return "visible";
}
