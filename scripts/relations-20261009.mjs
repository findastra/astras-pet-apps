// Builds RELATIONS.md and MOOD-KEY.md from pets.json. Claude Opus 5.5 (claude-opus-5-5), 2026-10-09.
// Both are generated: edit pets.json ("relations", "mood_key", each pet's "audit"), then npm run build.
import { allPets, moodKey, auditDay } from './farmer-rounds-20261009.mjs';

const ORDER = ['sleep', 'idle', 'blink', 'curious', 'happy', 'worried', 'alarmed', 'sick', 'sad'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const id = (repo) => repo.replace(/[^a-z0-9]/gi, '_');
const q = (s) => s.replace(/"/g, "'");

function names(registry) {
  const n = { astra: 'Astra', profile: 'Profile README', pets: 'Every pet' };
  for (const p of allPets(registry)) n[p.repo] = p.pet + (p.stage === 'pipeline' ? ' *' : '');
  return n;
}

export function buildRelations(registry) {
  const rel = registry.relations;
  const n = names(registry);
  const out = [];
  out.push('# How the pets relate', '');
  out.push('*Generated from `relations`, `rounds` and `pipeline` in [pets.json](pets.json) by `npm run build`. Edit pets.json, not this file. The rules behind it are in [PET-FILES.md](PET-FILES.md).*', '');

  out.push('## How a change is saved', '');
  out.push('Changes start at the bottom and are saved upward. Nothing generated is edited by hand.', '');
  out.push('| Level | Who | Owns | Saves by |', '|---|---|---|---|');
  out.push('| 1 | **Astra** | Approvals: new art (it costs money), a pet\'s job, anything in a card waiting on her | Answering a card, or telling an assistant |');
  out.push('| 2 | **Friendly Farmer** (`astras-pet-apps`) | `pets.json`: who exists, kinds, art, relations, the mood key | His daily round, and assistants working on the Cage |');
  out.push('| 3 | **Each pet\'s repo** | Its own app, README, cards, and its own name, job, status, bubble lines, mood lines and audit | Editing its `pet.json`, and submitting identity changes in `cage.submit` |');
  out.push('| 4 | **Generated** | `cage-data.js`, `ROSTER.md`, the README table, the Farmer\'s desk, `MOOD-KEY.md`, this file, `status/pets-status.json`, the profile\'s pet list | Never by hand: the build and the rounds rewrite them |', '');
  out.push('```mermaid', 'flowchart TD');
  out.push('  A(["Astra"]) -->|asks| S["Any assistant session"]');
  out.push('  S -->|creates or changes| P["Pet repo<br/>pet.json · README · handoffs/"]');
  out.push('  P -->|"cage.submit in pet.json"| F{{"Friendly Farmer<br/>daily round"}}');
  out.push('  F -->|finds new pet repos| PL["pets.json pipeline"]');
  out.push('  PL -->|"register card + Astra OKs the art"| R["pets.json pets"]');
  out.push('  F -->|"self-audit on each pet\'s day"| ST["status/pets-status.json<br/>mood + bubble"]');
  out.push('  R --> B["npm run build"]');
  out.push('  ST --> B');
  out.push('  B --> C["Cage page · ROSTER.md · Farmer\'s desk<br/>MOOD-KEY.md · RELATIONS.md"]');
  out.push('  R --> PR{{"Profile round, daily"}}');
  out.push('  PR --> PF["findastra/findastra README"]');
  out.push('  R -->|"registry, pet words"| G{{"GitHub Goldfish"}}');
  out.push('  G -->|"findings as cards"| F');
  out.push('  ST -->|"sick pets: Needs you"| A');
  out.push('```', '');

  out.push('## Who tells whom', '');
  out.push('Thick arrows work today. Plain arrows are planned (in a plan or a card). Dotted arrows are ideas nobody has agreed to yet. A name with * is in the pipeline: on GitHub, not registered in the Cage yet.', '');
  out.push('```mermaid', 'flowchart LR');
  const used = new Set(rel.links.flatMap((l) => [l.from, l.to]));
  const grouped = new Set();
  for (const [group, members] of Object.entries(rel.groups || {})) {
    const inGroup = members.filter((m) => used.has(m) || group === 'Private');
    if (!inGroup.length) continue;
    out.push(`  subgraph ${id(group)}["${group}"]`);
    for (const m of inGroup) { out.push(`    ${id(m)}["${q(n[m] || m)}"]`); grouped.add(m); }
    out.push('  end');
  }
  for (const m of used) if (!grouped.has(m)) out.push(`  ${id(m)}${m === 'astra' ? '(["Astra"])' : `["${q(n[m] || m)}"]`}`);
  const arrow = { now: '==>', planned: '-->', idea: '-.->' };
  for (const l of rel.links) out.push(`  ${id(l.from)} ${arrow[l.state]}|${l.carries}| ${id(l.to)}`);
  out.push('```', '');

  out.push('### What travels', '');
  out.push('| Kind | Means |', '|---|---|');
  for (const [k, v] of Object.entries(rel.carries)) out.push(`| \`${k}\` | ${v} |`);
  out.push('');
  out.push('### Every link', '');
  out.push('| From | To | Carries | State | Why |', '|---|---|---|---|---|');
  for (const l of rel.links) out.push(`| ${n[l.from] || l.from} | ${n[l.to] || l.to} | \`${l.carries}\` | ${l.state} | ${l.why} |`);
  out.push('');
  out.push(`### Private pets`, '', `${rel.private.map((r) => n[r] || r).join(', ')}. ${rel.private_rule}`, '');
  const alone = allPets(registry).filter((p) => !used.has(p.repo) && !rel.private.includes(p.repo) && p.role !== 'host');
  if (alone.length) out.push('### On their own so far', '', `${alone.map((p) => n[p.repo]).join(', ')}. Every pet still submits to the Farmer and audits itself; these have no links to other pets yet.`, '');
  return out.join('\n');
}

export function buildMoodKey(registry) {
  const key = registry.mood_key;
  const out = [];
  out.push('# Mood key', '');
  out.push('*What each mood means, for every pet. Generated from `mood_key` and each pet\'s `audit` in [pets.json](pets.json) by `npm run build`. The Farmer\'s desk shows the same key with each pet\'s current mood and bubble.*', '');
  out.push('Every pet uses the same meanings, so a face reads the same everywhere. `{subject}` is what the pet checks; `{needs}` is what it asks Astra for when it is sick.', '');
  out.push('| Mood | Means |', '|---|---|');
  for (const m of ORDER) out.push(`| \`${m}\` | ${key[m]} |`);
  out.push('');
  out.push('## Each pet', '');
  out.push('A pet changes its own lines by submitting `moods` (and `audit`) in `cage.submit` in its pet.json. See [PET-FILES.md](PET-FILES.md).', '');
  out.push('| Pet | Checks | How often | When it is sick it needs |', '|---|---|---|---|');
  for (const p of allPets(registry)) {
    const a = p.audit || {};
    const when = a.cadence === 'weekly' ? `weekly, ${DAYS[auditDay(registry, p.repo)]}` : a.cadence;
    const custom = p.moods ? ` (custom lines: ${Object.keys(p.moods).join(', ')})` : '';
    out.push(`| **${p.pet}**${p.stage === 'pipeline' ? ' *' : ''} | ${a.subject} | ${when} | ${moodKey(registry, p).sick.replace(/^I need you: /, '').replace(/\.$/, '')}${custom} |`);
  }
  out.push('', '\\* in the pipeline: on GitHub, not registered in the Cage yet.', '');
  return out.join('\n');
}
