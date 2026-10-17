// Idle Flash Audit: after a --dry fixer run, prints each changed spot in the clones with 50
// characters of context, so every change is read before anything is pushed. Claude Opus 5.5, 2026-10-17.
//   node scripts/idle-flash-showdiff-20261017.mjs <clones-dir> [repo,repo]
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
const C = process.argv[2] || 'c';
const only = process.argv[3] ? process.argv[3].split(',') : null;
for (const repo of readdirSync(C)) {
  if (only && !only.includes(repo)) continue;
  const d = `${C}/${repo}`;
  const files = execFileSync('git', ['-c', 'core.safecrlf=false', 'diff', '--name-only'], { cwd: d, encoding: 'utf8' }).split('\n').filter(Boolean);
  const added = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: d, encoding: 'utf8' }).split('\n').filter(Boolean);
  console.log(`=== ${repo}${added.length ? '  (new: ' + added.join(', ') + ')' : ''}`);
  for (const f of files) {
    const out = execFileSync('git', ['-c', 'core.safecrlf=false', 'diff', '-U0', '--word-diff=plain', '--word-diff-regex=[^ <>"\'(),]+', '--', f], { cwd: d, encoding: 'utf8', maxBuffer: 64 << 20 });
    const spots = [];
    for (const line of out.split('\n')) {
      if (!/\[-|\{\+/.test(line)) continue;
      const re = /\[-(.*?)-\]|\{\+(.*?)\+\}/g; let m;
      while ((m = re.exec(line))) { const s = Math.max(0, m.index - 50); spots.push(line.slice(s, m.index + m[0].length + 30).replace(/\s+/g, ' ')); }
    }
    console.log(`  ${f}: ${spots.length} spot(s)`);
    for (const s of spots.slice(0, 12)) console.log(`    ${s}`);
  }
}
