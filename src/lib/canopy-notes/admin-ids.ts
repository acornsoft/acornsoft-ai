/**
 * Split `CANOPY_ADMIN_USER_IDS`. Empty, blank, or missing means nobody.
 * There is no built-in id. Segments are trimmed. Empty segments are dropped.
 */
export function parseCanopyAdminUserIds(raw: string | null | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}
