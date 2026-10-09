# Requests

What Astra has asked each app for, one file per app: `<repo>.json`. Each app page has a pocket
companion at the bottom right, like Chip on Data Dealer; click it and its chat pops up. Its
Edits tab shows this file: open requests under **Upcoming**, finished ones taken off the list
and kept under **Made**. A request that needs Astra makes the pet sick and puts a badge on its
device until she answers.

Astra types new requests into an app's chat. They stay in that browser until an assistant
adds them here; the chat's **Copy for an assistant** button gives her the text to paste.

## For every assistant
- Before any task or update on an app, read its `requests/<repo>.json` and do the open
  requests that fit the work, oldest first.
- Add requests Astra gives you (in chat or pasted from an app) here with `status: "open"`,
  keeping her words in `said` and the page's id if it has one.
- When a request is made: `status: "done"`, `done` (America/Denver date), `by` (model name
  and version), and a one-line `note` saying what changed and anything left out.
- When you cannot go on without Astra: `status: "needs-astra"` and a plain `question` that
  says exactly what you need and how she can give it.
- `npm run build` copies these files into the app pages; `npm test` checks them.

Statuses: `open`, `in-progress`, `needs-astra`, `done`.
