export const NOTE_KINDS = ["product", "foundation", "engagement", "other"] as const;

export type NoteKind = (typeof NOTE_KINDS)[number];

export type CanopyNote = {
  noteId: string;
  kind: NoteKind;
  title: string;
  bodyMd: string;
  createdAt: string;
  updatedAt: string;
  onAllowlist: boolean;
};

export type AuditAction =
  | "assign"
  | "unassign"
  | "allowlist_add"
  | "allowlist_remove"
  | "revoke"
  | "restore"
  | "note_upsert";

export type AuditRow = {
  id: number;
  at: string;
  actorUserId: string;
  action: AuditAction;
  noteId: string | null;
  targetUserId: string | null;
};

export function isNoteKind(value: string): value is NoteKind {
  return (NOTE_KINDS as readonly string[]).includes(value);
}
