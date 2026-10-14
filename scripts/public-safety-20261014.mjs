// Public pages never show operational details (security ticket, 2026-10-14). GitHub Pages publishes this whole repo,
// so the data that generated pages embed is cleaned here: local service addresses and ports, local network addresses
// and personal folder paths become plain descriptions, and anything that looks like a secret stops the build.
// The real addresses stay on each PC only: see docs/local-services-20261014.md.
// Claude Opus 5.5 (claude-opus-5-5), 2026-10-14.

// Operational details: replaced with a description, so relationships stay and only the address goes.
export const OPERATIONAL = [
  { kind: 'local service address', as: 'a local service on this PC',
    re: /(?:https?:\/\/)?(?:\blocalhost|\b127(?:\.\d{1,3}){3}|\b0\.0\.0\.0|\[::1?\])(?::\d{2,5})\/?/gi },
  { kind: 'local network address', as: 'a device on the local network',
    re: /(?:https?:\/\/)?\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?::\d{2,5})?\b\/?/g },
  { kind: 'personal folder path', as: '%USERPROFILE%',
    re: /\b[A-Za-z]:[\\/]+Users[\\/]+(?!(?:example|Public|Default)\b)[^\\/\s"'`<>%]+/gi },
];

// Secrets: never replaced quietly. A secret that reached a public file has to be rotated, so the build stops.
export const SECRETS = [
  { kind: 'OpenAI or Anthropic API key', re: /\bsk-(?:ant-)?[A-Za-z0-9_-]{20,}/g },
  { kind: 'GitHub token', re: /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})/g },
  { kind: 'Slack token', re: /\bxox[abpr]-[A-Za-z0-9-]{10,}/g },
  { kind: 'AWS access key', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { kind: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}/g },
  { kind: 'private key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { kind: 'Discord webhook', re: /discord(?:app)?\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+/g },
  { kind: 'Discord bot token', re: /\b[MNO][A-Za-z0-9]{23,25}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,}/g },
];

const count = (text, re) => (text.match(re) || []).length;

// Every match in a text, by kind. Values are never returned, so a report can be printed safely.
export function findSensitive(text, { operational = OPERATIONAL, secrets = SECRETS } = {}) {
  const found = [];
  for (const { kind, re } of [...secrets, ...operational]) { const n = count(text, re); if (n) found.push({ kind, count: n, secret: secrets.some((s) => s.kind === kind) }); }
  return found;
}

export function redactText(text) {
  let out = text;
  for (const { re, as } of OPERATIONAL) out = out.replace(re, as);
  return out;
}

// A cleaned deep copy of JSON-like data. Each change is reported as { path, kind }, never with the value.
export function redactData(value, path = '$', changes = []) {
  if (typeof value === 'string') {
    for (const { kind, re } of SECRETS) if (count(value, re)) throw new Error(`Public safety: a ${kind} is in ${path}. Remove it and rotate it; it must never be published.`);
    const out = redactText(value);
    if (out !== value) for (const { kind, re } of OPERATIONAL) if (count(value, re)) changes.push({ path, kind });
    return out;
  }
  if (Array.isArray(value)) return value.map((v, i) => redactData(v, `${path}[${i}]`, changes));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redactData(v, `${path}.${k}`, changes)]));
  return value;
}

// The last gate before a public file is written: it must hold no secret and no operational detail.
export function assertPublic(text, file) {
  const found = findSensitive(text);
  if (found.length) throw new Error(`Public safety: ${file} would publish ${found.map((f) => `${f.count} ${f.kind}${f.count > 1 ? 's' : ''}`).join(', ')}.`);
  return text;
}
