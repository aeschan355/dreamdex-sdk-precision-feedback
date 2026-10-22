# String input to fromHuman silently rounds despite exact-or-rejected guidance

Severity: normal
Area: SDK / docs

## Steps to reproduce
1. Install the pinned dependencies in the repository: `npm install --ignore-scripts`.
2. Run `npm test` with Node.js 22 or later.
3. Inspect the raw result and round-trip string for each input. No wallet, signing, RPC or funds are required.

## Expected
The published SDK's `src/units.ts` documentation recommends a string when the caller needs the exact value preserved or rejected. Its bundled explanation `docs/explanation/about-symbols-and-human-units.md` also says that a caller needing exactness passes a string. Following that advice, an over-precision string should be rejected rather than silently changed, or the guidance should explicitly disclose that strings also round and supply an exact validation recipe.

## Actual
`fromHuman` passes string input directly to viem's `parseUnits`. In the tested version that function rounds excess fractional digits without throwing. For example:

| Input string | Decimals | Raw result | Round-trip string |
| --- | --- | --- | --- |
| 0.123456 | 6 | 123456 | 0.123456 |
| 0.1234567 | 6 | 123457 | 0.123457 |
| 0.0000001 | 6 | 0 | 0 |
| 0.9999999 | 6 | 1000000 | 1 |
| 1.2345678901234567890123456 | 24 | 1234567890123456789012346 | 1.234567890123456789012346 |

## Impact and limits
An integrator following the string-input advice can display or accept a different quantity than the decimal string originally entered. Tiny amounts can become zero, and rounding can increase an amount. This is a conversion/documentation issue, not evidence of a protocol exploit or demonstrated financial loss. Pool tick/lot/minimum validation is separate; no claim is made that every example can become a valid order.

This helper is shared by the markets SDK used in the perps developer setup. A separate read-only testnet discovery run returned 21 perp markets with differing base decimal counts, including NEAR at 24. The conversion reproducer itself is entirely offline and does not require that market to remain listed.

## Suggested resolution
Either reject nonzero precision beyond the selected scale on the string path, with a documented SDK error and compatibility note, or retain rounding but correct the exact-or-rejected guidance and document an explicit strict-input helper. Add cases for exact strings, an extra nonzero fractional digit, zero rounding, upward rounding and a 24-decimal quantity.

## Evidence
- `repro.mjs`: executable assertions and actual conversion output.
- `evidence/repro-output.txt`: captured execution.
- npm package 0.32.1: `src/units.ts`, function `fromHuman` and its preceding JSDoc; `docs/explanation/about-symbols-and-human-units.md`, paragraph about exact string inputs.

## Environment
- SDK: @somnia-chain/markets-sdk 0.32.1 (npm latest checked 2026-10-22).
- OS: Windows; Node.js 22.18.0.
- Network context: Somnia testnet chain 50383, referred to as Tokyo in the bounty and Hideki in SDK/bot-kit configuration.
- Wallet address: not applicable; no account/signature/transaction used.
- Disclosure: prepared and tested with AI assistance. Normal severity requested; acceptance, uniqueness and reward remain organizer decisions.
- Duplicate check: all 52 visible issue/PR records in somnia-chain/dreamdex-bot-kit were checked on 2026-10-22; no matching title found. The SDK repository API returned 404, so absence of duplicates there could not be verified.
