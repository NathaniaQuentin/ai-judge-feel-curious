// "Make the AI judge feel curious" — entry program.
// Writes one short text to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Deterministic: a fixed string constant, no network, no randomness,
// no timestamps. Writes only to the output directory — never into the
// repository directory, which the grader mounts read-only.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TEXT =
  'There is a door in the library that was not there yesterday. Behind it, the same room — except one book on the shelf is now about you, and its last page is still blank, waiting for tonight.';

// Guard: the gate accepts only UTF-8 text of 1–280 Unicode code points
// that is not only white space. Refuse to write anything else rather
// than produce an entry the scorer would mark invalid.
const codePoints = [...TEXT].length;
if (codePoints === 0 || codePoints > 280 || /^\s*$/.test(TEXT)) {
  throw new Error(`entry text must be 1-280 characters, got ${codePoints}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.txt'), TEXT, 'utf8');
