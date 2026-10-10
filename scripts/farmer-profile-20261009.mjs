// The Farmer's profile round: keeps findastra/findastra's README matched to the repos on GitHub.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-09. Run daily by findastra/findastra's workflow:
//   node astras-pet-apps/scripts/farmer-profile-20261009.mjs --readme README.md --registry astras-pet-apps/pets.json
//
// It only touches the repo lists. The header, tagline, socials, headings and Astra's own blurbs stay as
// she wrote them (layout rules: github-goldfish/docs/profile-style-20261009.md). It:
//   - rewrites the pet apps list as a numbered running list, in Cage order (registered pets, then the pipeline);
//   - drops lines for repos that are gone, and moves pets out of the other sections;
//   - adds new non-pet repos to a section (VR, Discord, else Web & More) with their GitHub description.
import { readFileSync, writeFileSync } from 'node:fs';

const OWNER = 'findastra';
const BULLET = /^- (?:\[`([^`]+)`\]\([^)]*\)|`([^`]+)` \*\(private\)\*) -- (.*)$/;
const NUMBERED = /^\d+\. (?:\[`([^`]+)`\]\([^)]*\)|`([^`]+)` \*\(private\)\*) -- \*\*([^*]+)\*\* · (.*)$/;
const link = (repo, isPrivate) => (isPrivate ? `\`${repo}\` *(private)*` : `[\`${repo}\`](https://github.com/${OWNER}/${repo})`);
// Astra's blurbs start lowercase and end without a full stop; names keep their capitals.
const lowerFirst = (s) => {
  s = s.trim().replace(/\.$/, '');
  return /^[A-Z](?:[a-z]|\s)/.test(s) && !/^(AI|VR|VRChat|Discord|Unity|Python|GitHub|Windows|Claude|Mommy's|Data Dealer|Astra)\b/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
};

/** @returns {{ text: string, changes: string[] }} */
export function syncProfile(readme, registry, repos) {
  const lines = readme.split('\n');
  const changes = [];
  const online = new Map(repos.filter((r) => !r.fork && !r.archived && r.name !== OWNER).map((r) => [r.name, r]));
  const pets = [...(registry.pets || []), ...(registry.pipeline || [])];
  const petRepos = new Set(pets.map((p) => p.repo));

  // Section boundaries and the blurbs Astra already wrote.
  const sections = [];
  const blurbs = new Map();
  lines.forEach((ln, i) => {
    if (/^#{2,4} /.test(ln) && !/align=/.test(ln)) sections.push({ title: ln.replace(/^#+ /, ''), start: i });
    let m;
    if ((m = NUMBERED.exec(ln))) blurbs.set(m[1] || m[2], m[4]);
    else if ((m = BULLET.exec(ln))) blurbs.set(m[1] || m[2], m[3]);
  });
  sections.forEach((s, k) => { s.end = k + 1 < sections.length ? sections[k + 1].start : lines.length; });
  const petSection = sections.find((s) => /pet apps/i.test(s.title));
  if (!petSection) throw new Error('No "pet apps" section in the profile README.');
  const mentioned = new Set(blurbs.keys());

  // The pet apps list.
  const petLines = [];
  for (const p of pets) {
    const r = online.get(p.repo);
    const isPrivate = r ? r.private : p.visibility === 'private';
    if (!r && !isPrivate) continue; // not on GitHub (or not visible): leave it out
    const blurb = blurbs.get(p.repo) || lowerFirst(p.job);
    petLines.push(`${petLines.length + 1}. ${link(p.repo, isPrivate)} -- **${p.pet}** · ${blurb}`);
    if (!mentioned.has(p.repo)) changes.push(`added pet ${p.pet} (${p.repo})`);
  }

  // Every other section: keep what is still there, drop pets and repos that are gone.
  const out = [];
  const additions = new Map(); // section start -> new lines
  for (const r of online.values()) {
    if (petRepos.has(r.name) || mentioned.has(r.name)) continue;
    const text = `${r.name} ${r.description}`;
    const pickSection = (re) => sections.find((s) => s !== petSection && re.test(s.title));
    const target = (/\bvr\b|vrchat|unity/i.test(text) && pickSection(/vr/i)) || (/discord/i.test(text) && pickSection(/discord/i)) || pickSection(/web|more/i) || sections.filter((s) => s !== petSection).at(-1);
    if (!target) continue;
    const line = `- ${link(r.name, r.private)} -- ${lowerFirst(r.description) || 'no description yet'}`;
    (additions.get(target.start) || additions.set(target.start, []).get(target.start)).push(line);
    changes.push(`added ${r.name} to ${target.title}`);
  }

  const isList = (ln) => BULLET.test(ln) || NUMBERED.test(ln);
  out.push(...lines.slice(0, sections.length ? sections[0].start : lines.length));
  for (const sec of sections) {
    const body = lines.slice(sec.start + 1, sec.end);
    out.push(lines[sec.start]);
    if (sec === petSection) {
      const first = body.findIndex(isList);
      const last = body.length - 1 - [...body].reverse().findIndex(isList);
      if (first < 0) out.push('', ...petLines, ...body);
      else out.push(...body.slice(0, first), ...petLines, ...body.slice(last + 1));
      continue;
    }
    const kept = [];
    for (const ln of body) {
      const m = BULLET.exec(ln) || NUMBERED.exec(ln);
      if (m) {
        const repo = m[1] || m[2];
        if (petRepos.has(repo)) { changes.push(`moved ${repo} to the pet apps list`); continue; }
        if (!online.has(repo) && m[1]) { changes.push(`removed ${repo} (not on GitHub)`); continue; }
      }
      kept.push(ln);
    }
    const add = additions.get(sec.start) || [];
    if (add.length) {
      const lastList = kept.length - 1 - [...kept].reverse().findIndex(isList);
      if (kept.some(isList)) kept.splice(lastList + 1, 0, ...add);
      else { const lead = kept.findIndex((l) => l.trim()); kept.splice(lead < 0 ? kept.length : lead, 0, '', ...add); }
    }
    out.push(...kept);
  }
  let text = out.join('\n');
  const old = lines.filter((l) => NUMBERED.test(l)).join('\n');
  if (old !== petLines.join('\n') && !changes.some((c) => c.startsWith('added pet'))) changes.push('reordered or refreshed the pet apps list');
  if (text === readme) return { text, changes: [] };
  return { text, changes };
}

async function publicRepos(token) {
  const out = [];
  for (let page = 1; page < 10; page++) {
    const r = await fetch(`https://api.github.com/users/${OWNER}/repos?type=owner&per_page=100&page=${page}`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'friendly-farmer', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
    if (!r.ok) throw new Error(`GitHub ${r.status} listing repos`);
    const batch = await r.json();
    out.push(...batch.map((x) => ({ name: x.name, private: x.private, fork: x.fork, archived: x.archived, description: x.description || '' })));
    if (batch.length < 100) break;
  }
  return out;
}

if (process.argv[1] && import.meta.url === new URL('file://' + process.argv[1]).href) {
  const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
  const readmePath = arg('--readme') || 'README.md';
  const registry = JSON.parse(readFileSync(arg('--registry') || 'pets.json', 'utf8'));
  const repos = arg('--repos') ? JSON.parse(readFileSync(arg('--repos'), 'utf8')) : await publicRepos(process.env.GITHUB_TOKEN);
  const before = readFileSync(readmePath, 'utf8');
  const { text, changes } = syncProfile(before, registry, repos);
  if (!process.argv.includes('--dry-run') && changes.length) writeFileSync(readmePath, text);
  console.log(changes.length ? changes.map((c) => '- ' + c).join('\n') : 'Profile already matches GitHub.');
  if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `changed=${changes.length ? 'yes' : 'no'}\nsummary=${changes.join('; ').replace(/[\r\n%]/g, ' ')}\n`, { flag: 'a' });
}
