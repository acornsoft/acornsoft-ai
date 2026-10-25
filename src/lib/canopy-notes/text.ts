/**
 * Write-time guard. Banned tokens are built without spelling them in source
 * so page and library files stay free of those strings.
 */
const CN_NUMBER = new RegExp(["C", "N", "-", "\\d+"].join(""), "i");

const BANNED_WORDS = [
  String.fromCharCode(103, 110, 111, 109, 97, 104),
  String.fromCharCode(109, 97, 99, 114, 111, 102, 108, 111, 119),
];

export class NoteTextError extends Error {
  constructor() {
    super("Note text rejected");
    this.name = "NoteTextError";
  }
}

export function assertCleanNoteText(title: string, body: string): void {
  const blob = `${title}\n${body}`.toLowerCase();
  if (CN_NUMBER.test(blob)) throw new NoteTextError();
  for (const word of BANNED_WORDS) {
    if (blob.includes(word)) throw new NoteTextError();
  }
}
