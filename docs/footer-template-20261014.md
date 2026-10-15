# footer-template v1.0

Made by Astra. Implemented with OpenAI Codex (GPT-6), 2026-10-14.

Editor: `apps/footer-template-20261014.html`. Shared Web Component:
`apps/footer-template-20261014.js`. This is a reusable website tool, not a new pet
or independent agent. It needs no account, installation, model or backend.

The rounded bordered footer is always one horizontal line:
**Made by Astra · YYYY-MM-DD · Find Out More → [GitHub] [Pole TikTok] [VR TikTok] · Take Me Home! → [Farmer coin]**.
Bracketed items are icons only. Accessible names and hover labels identify them.
Narrow screens scroll the footer horizontally; the line never wraps.

Defaults approved by Astra: GitHub `https://github.com/findastra`, Pole
`https://www.tiktok.com/@astra_on_fire`, VR `https://www.tiktok.com/@findastra`.
The Farmer links to The Farm. It uses the existing approved Farmer image, a
58px gold coin with 5% diameter depth, and respects reduced motion.

The editor changes the date, links, border, background, text, radius and coin size.
Save persists only in this browser; it does not silently modify every site.
Copy embed references the versioned component at the hub's public URL, which
requires deployment. Download embeds the code in an HTML file; the Farmer art
still uses its existing public URL. Offline use must package that image locally
and adapt the image URL policy deliberately. The current component accepts HTTPS
links only and rejects credentials and executable URL schemes.

Run `node scripts/build-footers-20261014.mjs` after generating or refreshing app
copies. This idempotent step applies the shared footer to all hub-hosted Pet
Program pages. It preserves existing version links, license information and
operational controls. The signature date is an explicit publication/edit date,
not the visitor's current date. The new shared footer is a hub presentation change;
existing source-release links describe upstream program code, not this footer.

Individual repository deployments still need to adopt the same component in
their own source/build pipeline during their Flash Audit. A change to this hub
does not prove those independent deployments have changed.

## Flash Audit acceptance

- One shared bordered signature, one visual line at narrow and wide widths.
- Exact credit and valid YYYY-MM-DD date; no duplicate legacy signature.
- All four icon links have correct destinations, accessible names and focus styling.
- Farmer coin fits the border, spins, pauses on hover/focus and respects reduced motion.
- Editor previews, persists, resets and exports; edited URLs cannot execute script.
- Record hub deployment and individual-repository adoption separately.
