# Mail Shell: tool decisions

Recorded from Astra's naming round on 2026-10-14 by OpenAI Codex (GPT-6).
Owner: Mail Snail, program 24, Mail Shell. Status: approved product requirements;
implementation and provider connections are not built. No account access authorized by this document.

## Tools requested by Astra

- `all-email-addresses`: enter multiple email addresses, extract each domain, suggest
  its provider, and let the user correct the suggestion. An address is not a connected
  account. Custom domains and aliases must not be treated as proof of the host or identity.
- `junk-identifier`: search the selected inbox for likely junk and collect matches
  into a folder/label named after the tool for the user to sort manually.
- `bills-identifier`: search for bills and due dates, with the same named review folder.
- Chat-based tool creation: describe another tool in Mail Shell's chat; dispatch a
  build request to an authorized coding agent; add the tool to the list with progress.
  Show green Ready with text when the version has passed checks. Clicking it starts
  the provider connection/sign-in flow if needed, then its authorized search workflow.

The default workflow is search, preview matches, move/apply labels to the named review
folder, then open it for hand sorting. Record original folders/labels for undo, report
partial failures, and avoid duplicate moves on retry. No automatic deletion or sending.
Confirmation of the move can be a per-tool preference approved by the user; new rules
begin with preview. Bill sharing with Nest Egg remains a proposal, not approved by this reply.

## Provider plan and limits

Detect on entry. Prioritize Gmail/Google Workspace, Outlook/Hotmail/Microsoft 365,
and iCloud. Add other providers when entered and supported; show unsupported honestly.
Domain recognition is a hint, not authentication. Use provider adapters so the search
rule can be reused across inboxes without duplicating generated code per account.

- Gmail uses labels (including removal of the Inbox label when approved), not ordinary folders.
  Reference: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/modify
- Microsoft Graph supports moving messages between mailbox folders.
  Reference: https://learn.microsoft.com/en-us/graph/api/message-move?view=graph-rest-1.0
- iCloud supports IMAP; connection setup may need an app-specific password.
  Reference: https://support.apple.com/en-us/102525

Web inbox sign-in alone does not authorize an unrelated application to operate on mail.
Use supported provider authorization/adapters; never inject arbitrary generated code
into the inbox. Keep credentials in an OS-backed credential store, not page storage,
chat prompts, GitHub, or tool source. Account addresses and message data stay private.

## Creation and execution checks

Prefer declarative search rules over new executable code for ordinary identifiers.
Where code is needed: maker drafts, independent checker reviews, tests run on synthetic
mail, and the exact version and permissions are recorded before Ready. Generated code
cannot grant itself access. Mail content is untrusted data, never a tool-build instruction.
Build readiness and account connection are separate indicators. A new permission needs
owner approval even if the tool is green. Existing security controls are planned, not
deployed merely because this workflow describes them.

Every Pet Program tool has a manual checkbox on its LEFT labelled "Not working"
(the framework's sick report). It is separate from ON/OFF, records the user's report
in the backlog and the Farmer's broken-tools list, and is not cleared by passing tests.

## Artwork and launch audit, 2026-10-14

All nine local desktop emotion PNGs and the sheet matched blob hashes on
findastra/mail-snail main. The moods are calm, blink, happy, curious, worried, sad,
sick, shocked and asleep. Remote sprite.json nevertheless declares placeholder/no art;
repair that metadata in the individual repo. Its index.html is a placeholder, and the
configured desktop launch opens the GitHub repo rather than a working app page.

## Acceptance before calling it working

Verify account selection, custom-domain override, connection denial/revocation,
search preview, correct mailbox and folder/label, undo, partial failure/retry,
untrusted email content, tool OFF enforcement, the left-side manual report,
and Ready only for a reviewed/tested version. Verify live behavior separately from tests.
