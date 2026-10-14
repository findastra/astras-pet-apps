# Public pages and local services

GitHub Pages publishes this whole repo, so everything in it is public. Two kinds of information are kept apart.

| Public (this repo, GitHub Pages) | This PC only (never committed) |
|---|---|
| What each pet program and service is, and how they connect | Where it runs: addresses, ports, local network addresses |
| Service names, such as "OpenAI Discord Presence's control panel" | Keys, tokens, passwords, personal folder paths |

## Where the local addresses live

A page that opens a local service reads its addresses from a file next to it, named
`apps/<repo>-local-services-20261014.js`. The file is in `.gitignore`, so it never reaches GitHub. The page only
loads it when it was opened from the farm on this PC (a file, or a localhost address). On the public site, the page
shows the service names and says the controls run on your own PC.

The Discord Damsel page (`findastra-discord-presence`) uses
`apps/findastra-discord-presence-local-services-20261014.js`:

```js
window.LOCAL_SERVICES = {
  'openai-discord-presence': '<the control panel address from OpenAI Discord Presence on this PC>',
  'anthropic-discord-presence': '<the control panel address from Anthropic Discord Presence on this PC>',
};
```

Each companion prints its control panel address when it starts, and its README lists the default address. The page
only accepts `http://127.0.0.1:<port>/` or `http://localhost:<port>/`, so an edited file cannot send a button anywhere
else. The installer copies the whole folder, so an install made from your own copy keeps this file, and reinstalling
over an existing farm leaves it in place.

## The safety check

`npm run build` cleans the data that generated pages embed (`scripts/public-safety-20261014.mjs`):

- Local service addresses, local network addresses and personal folder paths are replaced with plain descriptions,
  and the build says where it removed them. Relationships stay; only the address goes.
- Anything that looks like a secret (API keys, tokens, private keys, webhooks) stops the build: a secret that
  reached a public file has to be rotated, not hidden.

`npm test` (`test/public-safety-test-20261014.mjs`) checks every committed file the same way, so a hand edit cannot
slip an address or a secret onto the public site either.
