import assert from 'node:assert/strict';
import { fromHuman, toHumanString } from '@somnia-chain/markets-sdk';

// Pure conversion tests: no signer, wallet, transactions or network requests.
const rows = [
  ['0.123456', 6, '123456', '0.123456'],
  ['0.1234567', 6, '123457', '0.123457'],
  ['0.0000001', 6, '0', '0'],
  ['0.9999999', 6, '1000000', '1'],
  ['1.2345678901234567890123456', 24, '1234567890123456789012346', '1.234567890123456789012346'],
];
for (const [input, decimals, expectedRaw, expectedText] of rows) {
  const raw = fromHuman(input, decimals);
  const roundtrip = toHumanString(raw, decimals);
  assert.equal(String(raw), expectedRaw);
  assert.equal(roundtrip, expectedText);
  console.log(JSON.stringify({ input, decimals, raw: String(raw), roundtrip,
    changed: input !== roundtrip }));
}
console.log('5 cases passed. Four over-precision strings rounded without throwing.');
