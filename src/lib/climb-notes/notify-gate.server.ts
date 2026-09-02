/**
 * Optional POST of a public /start draft to the Climb Notes quality gate.
 *
 * Env (Vercel):
 *   CLIMB_NOTES_GATE_WEBHOOK_URL
 *   CLIMB_NOTES_GATE_WEBHOOK_KEY
 *
 * Unset URL or key → skip, do not throw. One try, ~8s timeout, no retry.
 * Ping failure is logged and never thrown to the visitor.
 * Server-only.
 */

export type GateIntakeNote = {
  id: string;
  number: string;
  title: string;
  problem: string;
  measure: string;
  slice: string;
  lesson: string;
  name: string;
  email: string;
};

const TIMEOUT_MS = 8_000;

export async function notifyClimbNotesGate(
  note: GateIntakeNote,
): Promise<void> {
  const url = process.env.CLIMB_NOTES_GATE_WEBHOOK_URL?.trim();
  const key = process.env.CLIMB_NOTES_GATE_WEBHOOK_KEY?.trim();
  if (!url || !key) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "X-Automation-Key": key,
      },
      body: JSON.stringify({
        event: "public-start-intake",
        id: note.id,
        number: note.number,
        title: note.title,
        status: "draft",
        problem: note.problem,
        measure: note.measure,
        slice: note.slice,
        lesson: note.lesson,
        name: note.name,
        email: note.email,
        source: "www.acornsoft.ai/start",
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(
        `[climb-notes/gate] webhook responded ${res.status}`,
      );
    }
  } catch (err) {
    console.error(
      "[climb-notes/gate] webhook failed",
      err instanceof Error ? err.message : err,
    );
  }
}
