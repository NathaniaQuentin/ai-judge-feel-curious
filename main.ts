// Curiosity entry for make.fun: "Make the AI judge feel curious".
//
// The whole entry is one short text. The judge reads it cold, so the text
// has to do the work on its own: a small mystery, a concrete image, and a
// last line that leaves something unresolved instead of wrapping up.
//
// This program only carries that text to /output/entry.txt. It has no
// network, no randomness and no clock: run it twice and the bytes match.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The text itself. One quiet hook: a door that was not there yesterday,
// a book about the reader, and a blank last page still waiting.
const DRAFT =
  "There is a door in the library that was not there yesterday. " +
  "Behind it, the same room — except one book on the shelf is now " +
  "about you, and its last page is still blank, waiting for tonight.";

// The house gate counts Unicode code points, not UTF-16 units, and
// allows 1 to 280. Spread into an array to count code points honestly,
// so an emoji or an accented letter counts once, the way the gate does.
const GATE_MAX_POINTS = 280;

function countCodePoints(line: string): number {
  return [...line].length;
}

function checkDraft(line: string): void {
  if (line.length === 0) {
    throw new Error("entry text is empty");
  }
  if (line.trim().length === 0) {
    throw new Error("entry text is only whitespace");
  }
  const points = countCodePoints(line);
  if (points > GATE_MAX_POINTS) {
    throw new Error(
      `entry text is ${points} code points, over the ${GATE_MAX_POINTS} limit`,
    );
  }
}

// The harness points the program at its output folder through
// MAKEFUN_OUTPUT_DIR; on a plain local run it falls back to /output.
// The folder is created when missing and its contents are left alone:
// the grader bind-mounts this folder, so it must never be removed.
function resolveOutputFolder(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv !== "" ? fromEnv : "/output";
}

function publish(line: string): void {
  checkDraft(line);
  const folder = resolveOutputFolder();
  mkdirSync(folder, { recursive: true });
  const target = join(folder, "entry.txt");
  writeFileSync(target, line, "utf8");
  // Read the file back and confirm the bytes on disk are exactly the
  // text we meant to publish: a silent write failure must not pass
  // as a valid entry.
  const written = readFileSync(target, "utf8");
  if (written !== line) {
    throw new Error("entry.txt on disk does not match the entry text");
  }
}

publish(DRAFT);
