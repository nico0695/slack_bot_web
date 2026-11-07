# Personal assistant context integration

The assistant shares AI context with normal Slack DMs and authenticated REST requests, while this page retains only its own web-visible conversation. No cross-transport messages are broadcast.

The page sends the current Supabase access token on assistant join/send events. The backend derives the internal identity; client user IDs and channel keys are not trusted. A dedicated Socket.io transport is created per signed-in account, leaving the anonymous general conversations socket unchanged. Logout/account changes disconnect the old transport; reconnect joins again without retrying mutations.

Responses and progress keep the existing event names and first payload shape. The send event additionally accepts a completion acknowledgement; it clears busy state for skips and failed/unknown results too. Unknown outcomes use neutral wording: check stored data before repeating an action.

This change must be released with the backend feature branch `feature/assistant-shared-context` in `nico0695/slack_bot`. An old web client without tokens cannot use the protected assistant events. Neither PR deploys or merges automatically.

## Validation

- `node --test tests/useAssistantChat.test.mjs`: seven lifecycle regression tests.
- `npx tsc --noEmit --incremental false`.
- Targeted ESLint for the page, hook, socket factory and test.
- `npm run build`: passed with build-only placeholder Supabase URL/key; no live authentication or backend calls were verified.
- Existing `pnpm install --frozen-lockfile` fails because package configuration does not match the lockfile overrides. No dependency or lockfile changes are included; local verification used an installation without writing a new lockfile.
