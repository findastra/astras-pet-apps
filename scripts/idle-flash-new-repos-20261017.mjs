// Idle Flash Audit, step "every pet has a repo" (Astra, 2026-10-17: "make sure you start a repo
// for every pet that exists"). Claude Opus 5.5 (claude-opus-5-5), 2026-10-17.
//
// For every program in the hub's pet-programs.json whose repo is not on GitHub, and whose pet has
// a real name (not a pet-program-#-icon-# placeholder), this creates the repo the same way the 41
// seed and roadmap repos were started on 2026-10-14: public, topics astras-pet-os and pet-app,
// README, pet.json, AGENTS.md, CLAUDE.md and an MIT LICENSE, one commit "Start <repo>".
// It looks on GitHub itself; the catalog's repo_exists field is not trusted.
//
//   node scripts/idle-flash-new-repos-20261017.mjs [--dry] [--private]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DRY = process.argv.includes('--dry');
// --private: start the repo private (Astra makes it public when she is ready, like the 2026-10-14 ones).
const VIS = process.argv.includes('--private') ? '--private' : '--public';
const OWNER = 'findastra';
const HUB = 'astras-pet-os';
const TODAY = new Date().toISOString().slice(0, 10);
const gh = (...a) => execFileSync('gh', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 << 20 });
const exists = (repo) => { try { gh('api', `repos/${OWNER}/${repo}`, '--jq', '.full_name'); return true; } catch { return false; } };
const catalog = JSON.parse(gh('api', '-H', 'Accept: application/vnd.github.raw', `repos/${OWNER}/${HUB}/contents/pet-programs.json?ref=main`)).programs;
const placeholder = (s) => !s || /^pet-program-\d+(-icon-\d+)?$/.test(s);
const slug = (s) => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stageWords = { seed: 'Seed', roadmap: 'Roadmap', pipeline: 'Pipeline', registered: 'Registered' };
const stageLine = { seed: 'named and approved, not built yet', roadmap: 'on the roadmap, not built yet', pipeline: 'has a repo, not registered yet', registered: 'registered' };
const MIT = `MIT License\n\nCopyright (c) ${TODAY.slice(0, 4)} findastra\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n`;

const made = [];
for (const p of catalog) {
  if (!p.repo || exists(p.repo)) continue;
  if (placeholder(p.icon)) { console.error(`#${p.number}: pet has no name yet (${p.icon}); a repo waits for its name`); continue; }
  const repo = p.repo;
  const named = !placeholder(p.program);
  const desc = p.mini_descriptor?.text || 'Not decided yet.';
  const firstSentence = desc.split(/(?<=\.)\s/)[0];
  const node = slug(p.icon);
  const files = {
    'README.md': `# ${named ? p.program : repo}\n\n*A pet app by Astra.*\n\n**${p.icon}'s pet program** in [Astra's PetOS](https://github.com/${OWNER}/${HUB}): pet program #${p.number}.\nStage: **${stageWords[p.stage] || p.stage}**: ${stageLine[p.stage] || p.stage}.\n\n> **\`${p.mini_descriptor?.label || repo + '-v1.0-mini-descriptor-v1.0'}\`:** ${desc}\n\n${named ? '' : `Name not assigned yet${p.idea ? ` (idea: *${p.idea}*)` : ''}. Until then it is \`${repo}\`.\n\n`}${p.implementation_status ? `**Where the work is now:** ${p.implementation_status}\n\n` : ''}## Run it\n\nNothing to run here yet. When it is built, it follows the [Pet Program Framework](https://github.com/${OWNER}/${HUB}/blob/main/PET-PROGRAM-FRAMEWORK.md) and passes its checklist.\n\n## Limits\n\n- Nothing is built in this repo yet: no program, no runtime, no agent.\n- No pet art yet. Generating art costs money, so it waits on Astra.\n${named ? '' : '- The pet program has no name yet.\n'}\n## Where it fits\n\n- Every pet program: [PET-PROGRAMS.md](https://github.com/${OWNER}/${HUB}/blob/main/PET-PROGRAMS.md)\n- On the System Map: [${p.icon}](https://findastra.github.io/${HUB}/system-map-20261012.html#node=${node})\n- Rules: [AGENTS.md](AGENTS.md)\n\nStarted by Claude Opus 5.5 (\`claude-opus-5-5\`), ${TODAY}, in the Idle Flash Audit, at Astra's request.\n`,
    'pet.json': JSON.stringify({ pet: p.icon, program: p.program, number: p.number, kind: 'pet-app', owner: 'Astra', job: desc, mini_descriptor: { label: p.mini_descriptor?.label, text: desc }, status: 'seed', version: 'v0.1', framework: `https://github.com/${OWNER}/${HUB}/blob/main/PET-PROGRAM-FRAMEWORK.md`, cage: { topic: 'pet-app', home: `https://github.com/${OWNER}/${HUB}` }, built_with: `Claude Opus 5.5 (claude-opus-5-5), ${TODAY}, Idle Flash Audit` }, null, 2) + '\n',
    'AGENTS.md': `# Rules for assistants working on ${named ? p.program : repo}\n\n${p.icon}'s pet program, part of Astra's PetOS (https://github.com/${OWNER}/${HUB}). Public credit is always **Astra**.\nRead the hub's AGENTS.md, PROTECTION-RINGS.md, PET-PROGRAM-FRAMEWORK.md and \`skills/farm-security\` first, and build to\nthe framework's checklist. This pet is a ${p.stage}: it is not an animal on the farm until Astra lets it in at the gate.\nIts mini-descriptor lives in the hub's pet-programs.json; change it there, not only here. Changes to its name, job,\nstatus or audit are submitted to the Friendly Farmer through \`cage.submit\` in \`pet.json\`.\n\nKeep keys, \`.env\` files and personal data out of this repo. Record the model and version when an assistant changes it.\n\nCreated by Claude Opus 5.5 (\`claude-opus-5-5\`), ${TODAY}, in the Idle Flash Audit, at Astra's request.\n`,
    'CLAUDE.md': `# Assistant handoff\n\nRead and follow [AGENTS.md](AGENTS.md) first, then the hub's rules in [${OWNER}/${HUB}](https://github.com/${OWNER}/${HUB}/blob/main/AGENTS.md). Before changing anything, check GitHub for the newest handoff. Public credit is Astra. Record the model and version for changes.\n`,
    LICENSE: MIT,
  };
  const description = `${p.icon}'s pet program (#${p.number}, ${p.stage}): ${firstSentence}`.slice(0, 340);
  if (DRY) { console.error(`would create ${repo}: ${description}`); made.push({ repo, dry: true }); continue; }
  const dir = mkdtempSync(join(tmpdir(), 'idle-flash-new-'));
  try {
    for (const [name, body] of Object.entries(files)) writeFileSync(join(dir, name), body);
    const git = (...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    git('init', '-q', '-b', 'main');
    git('config', 'user.name', 'findastra');
    git('config', 'user.email', '88600745+findastra@users.noreply.github.com');
    git('add', '-A');
    git('commit', '-q', '-m', `Start ${repo}\n\n${p.icon}'s pet program (#${p.number}, ${p.stage}). Started in the Idle Flash Audit at Astra's request (2026-10-17: a repo for every pet).\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`);
    gh('repo', 'create', `${OWNER}/${repo}`, VIS, '--description', description, '--source', dir, '--push');
    gh('repo', 'edit', `${OWNER}/${repo}`, '--add-topic', 'astras-pet-os', '--add-topic', 'pet-app');
    made.push({ repo, url: `https://github.com/${OWNER}/${repo}` });
    console.error(`created https://github.com/${OWNER}/${repo}`);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
writeFileSync(join(tmpdir(), 'idle-flash-new-repos.json'), JSON.stringify(made, null, 1));
console.error(`done: ${made.length}`);
