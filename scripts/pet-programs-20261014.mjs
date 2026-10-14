// Renders PET-PROGRAMS.md from pet-programs.json: every pet program, its icon, repo and mini-descriptor.
// pet-programs.json is the source; Astra edits it (or asks), then npm run build refreshes this page.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-14.
import { readFileSync, writeFileSync } from 'node:fs';

const STAGE = { registered: 'Registered', pipeline: 'Pipeline', seed: 'Seed', roadmap: 'Roadmap' };

export function petProgramsTable(programs, { owner = 'findastra' } = {}) {
  const rows = programs.map((p) => `| ${p.number} | ${p.icon} | ${p.assigned ? `**${p.program}**` : p.program} | [${p.repo}](https://github.com/${owner}/${p.repo}) | ${STAGE[p.stage] || p.stage} | ${p.mini_descriptor.text}${p.mini_descriptor.reviewed ? '' : ' *(draft)*'} |`);
  return ['| # | Pet program icon | Pet program | Repo | Stage | Mini-descriptor |', '|---|---|---|---|---|---|', ...rows].join('\n');
}

export function buildPetProgramsPage(data) {
  const reviewed = data.programs.filter((p) => p.mini_descriptor.reviewed).length;
  return `# PET PROGRAMS

Every pet program in Astra's PetOS, numbered for good. Each **mini-descriptor** is one or two sentences on what the pet
program actually does; it is shown in the pet's own repo, the findastra profile and the System Map. Its label follows
the naming rules: \`<pet-program>-v1.0-mini-descriptor-v1.0\`. **Bold** program names are assigned; \`pet-program-#\`
means not named yet. *(draft)* means Astra has not reviewed it yet: ${reviewed} of ${data.programs.length} reviewed.

Generated from [pet-programs.json](pet-programs.json) by \`npm run build\`. Do not edit this page; edit the JSON.

${petProgramsTable(data.programs)}
`;
}

if (process.argv[1] && process.argv[1].endsWith('pet-programs-20261014.mjs')) {
  const data = JSON.parse(readFileSync('pet-programs.json', 'utf8'));
  writeFileSync('PET-PROGRAMS.md', buildPetProgramsPage(data));
  console.log(`PET-PROGRAMS.md: ${data.programs.length} pet programs`);
}
