import { describe, expect, it } from "vitest";
import { NOTE_KINDS, type NoteKind } from "./types";
import { isNoteVisible, routeForLookup, type VisibilityFacts } from "./visibility";

function facts(over: Partial<VisibilityFacts> & { kind: NoteKind }): VisibilityFacts {
  return {
    onAllowlist: false,
    assignedToCaller: false,
    revoked: false,
    signedIn: true,
    ...over,
  };
}

describe("note visibility", () => {
  it("shows an allowlisted note to everyone, including a revoked account", () => {
    for (const kind of NOTE_KINDS) {
      expect(
        isNoteVisible(facts({ kind, onAllowlist: true, signedIn: false, revoked: true })),
      ).toBe(true);
    }
  });

  it("shows an assigned note only while the account is signed in and not revoked", () => {
    const assigned = facts({ kind: "other", assignedToCaller: true });
    expect(isNoteVisible(assigned)).toBe(true);
    expect(isNoteVisible({ ...assigned, revoked: true })).toBe(false);
    expect(isNoteVisible({ ...assigned, revoked: false })).toBe(true);
    expect(isNoteVisible({ ...assigned, signedIn: false })).toBe(false);
  });

  it("hides product and foundation notes until they are allowlisted", () => {
    for (const kind of ["product", "foundation"] as const) {
      expect(isNoteVisible(facts({ kind, assignedToCaller: true }))).toBe(false);
      expect(isNoteVisible(facts({ kind, assignedToCaller: true, onAllowlist: true }))).toBe(true);
    }
  });

  it("shows engagement and other notes by assignment, and hides notes that are not assigned", () => {
    for (const kind of ["engagement", "other"] as const) {
      expect(isNoteVisible(facts({ kind, assignedToCaller: true }))).toBe(true);
      expect(isNoteVisible(facts({ kind, assignedToCaller: false }))).toBe(false);
    }
  });

  it("treats a revoked assigned note and a missing id as the same not-found result", () => {
    const assigned = facts({ kind: "other", assignedToCaller: true });
    const revoked = { ...assigned, revoked: true };
    expect(routeForLookup(assigned)).toBe("visible");
    expect(routeForLookup(revoked)).toBe("not-found");
    expect(routeForLookup(null)).toBe("not-found");
    expect(routeForLookup(revoked)).toBe(routeForLookup(null));
    expect(routeForLookup({ ...revoked, revoked: false })).toBe("visible");
  });

  it("keeps an allowlisted note visible after revoke, and hides the assigned one", () => {
    const allowlisted = facts({ kind: "product", onAllowlist: true, revoked: true });
    const assigned = facts({ kind: "other", assignedToCaller: true, revoked: true });
    expect(isNoteVisible(allowlisted)).toBe(true);
    expect(isNoteVisible(assigned)).toBe(false);
    expect(routeForLookup(allowlisted)).toBe("visible");
    expect(routeForLookup(assigned)).toBe("not-found");
  });
});
