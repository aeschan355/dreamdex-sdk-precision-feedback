# dreamDEX SDK precision feedback

One reproducible normal-severity SDK/documentation item for the dreamDEX Perps Builder Bounty Feedback track. This is a feedback report, not a trading MVP.

Read `feedback/001-string-input-rounding.md` for the steps, expected/actual behavior, impact and limitations.

## Run
Requires Node.js 22+ and npm.

```sh
npm install --ignore-scripts
npm test
```

Tests only call pure conversion functions. They do not sign, trade, connect a wallet or transfer tokens. The exact-scale input is a control; four over-precision strings demonstrate the undocumented rounding.

Prepared using AI assistance. No previous client work, accepted bounty, payout, security exploit or financial loss is claimed.
