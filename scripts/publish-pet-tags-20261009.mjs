// Finish the v0.1.1-20261009 square pet frame releases from Astra's PC.
// The commits are already on each repo's main; the Claude session that made them
// could not push tags or create releases. Claude Opus 5.5 (claude-opus-5-5), 2026-10-09.
//
//   node scripts/publish-pet-tags-20261009.mjs            create tags and pre-releases
//   node scripts/publish-pet-tags-20261009.mjs --dry-run  only check
//
// Needs git signed in to GitHub. Uses the GitHub CLI (gh) for the pre-releases if it is
// installed; otherwise prints the page where each release can be made by hand.
// Safe to re-run: an existing correct tag is left alone; a tag on any other commit stops the run.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const TAG = 'v0.1.1-20261009', PREVIOUS = 'v0.1.0-20261008';
const TAGGER = ['-c', 'user.name=Astra', '-c', 'user.email=findastra@users.noreply.github.com'];
const RELEASES = [
  ['unity-unicorn', '4b52289', 'Unity Unicorn · project desk draft'],
  ['drum-dog', 'b95703a', 'Drum Dog · music planner draft'],
  ['finance-finch', '031b001', 'Finance Finch · ledger draft'],
  ['health-hummy', '352470a', 'Health Hummy · daily journal draft'],
  ['mommys', 'c8cbbf8', 'Mommy’s Mommies · planning desk draft'],
  ['portfolio-puffer', '72da88b', 'Portfolio Puffer · update planner draft'],
  ['project-parrot', 'c411ef5', 'Project Parrot · project idea and reminder desk'],
  ['vscode-angel', '8fc6c2a', 'VSCode Angel · review desk draft'],
];
const dryRun = process.argv.includes('--dry-run');
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();
const has = (cmd) => { try { run(cmd, ['--version']); return true; } catch { return false; } };
const gh = has('gh');
let problems = 0;

for (const [repo, short, title] of RELEASES) {
  const url = `https://github.com/findastra/${repo}`;
  try {
    const main = run('git', ['ls-remote', url, 'refs/heads/main']).split(/\s/)[0];
    if (!main.startsWith(short)) throw new Error(`main is ${main.slice(0, 7)}, expected ${short}; someone changed it, review before tagging`);
    const peeled = run('git', ['ls-remote', url, `refs/tags/${TAG}^{}`, `refs/tags/${TAG}`]).split('\n').filter(Boolean);
    const tagged = (peeled.find((l) => l.endsWith('^{}')) || peeled[0] || '').split(/\s/)[0];
    if (tagged && tagged !== main) throw new Error(`${TAG} already exists on ${tagged.slice(0, 7)}; tags are immutable, not moving it`);
    if (!tagged && !dryRun) {
      const dir = mkdtempSync(join(tmpdir(), `${repo}-`));
      try {
        run('git', ['init', '-q'], { cwd: dir });
        run('git', ['fetch', '-q', '--depth', '1', url, main], { cwd: dir });
        run('git', [...TAGGER, 'tag', '-a', TAG, '-m', 'Astra pet app source 0.1.1-20261009', main], { cwd: dir });
        run('git', ['push', '-q', url, `refs/tags/${TAG}`], { cwd: dir });
      } finally { rmSync(dir, { recursive: true, force: true }); }
    }
    let release = 'not checked (dry run)';
    if (gh) {
      let exists = true;
      try { run('gh', ['release', 'view', TAG, '-R', `findastra/${repo}`]); } catch { exists = false; }
      if (!exists && !dryRun) {
        run('gh', ['release', 'create', TAG, '-R', `findastra/${repo}`, '--prerelease', '--verify-tag', '--title', `${title} · square pet frame`, '--notes',
          `The pet frame in the side rail is now square at every window width. It was 176×190 on wide windows, 151×190 at laptop widths (with the pet clipped) and 70×77 on phones. Layout only: records, storage and exports are unchanged.\n\nOpen ${repo}-20261008.html from the source ZIP.\n\nSource: ${url}/tree/${TAG}\nRollback: ${PREVIOUS} is unchanged. No published tag is moved.`]);
        exists = true;
      }
      release = exists ? 'pre-release ok' : 'pre-release missing';
    } else if (!dryRun) release = `make the pre-release by hand: ${url}/releases/new?tag=${TAG}&prerelease=1`;
    console.log(`${repo.padEnd(17)} main ${short}  tag ${tagged ? 'already there' : dryRun ? 'would create' : 'created'}  ${release}`);
  } catch (error) {
    problems++;
    console.error(`${repo.padEnd(17)} STOPPED: ${(error.stderr || error.message).toString().trim().split('\n')[0]}`);
  }
}
if (!gh) console.log('\nGitHub CLI (gh) not found, so pre-releases were not created. Use the links above, or install gh and run this again.');
process.exitCode = problems ? 1 : 0;
