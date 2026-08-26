import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { inflateRawSync } from 'zlib';
import { inflateSync } from '../src/index';

const test = suite('inflate');

// A raw-DEFLATE stream: one BFINAL dynamic block whose literal/length alphabet is
// just {0x41, EOB} at one bit each, plus a single 1-bit distance code, followed by
// n literals and EOB. A pure literal run has no match or block boundary to refresh
// the decoder's output reservation, so a decoder that only grows on those events
// silently truncates the result. zlib decodes it in full.
const craftLiteralRun = (n: number): Uint8Array => {
  const bytes: number[] = [];
  let cur = 0, nbit = 0;
  const put = (value: number, nbits: number) => {
    for (let i = 0; i < nbits; ++i) {
      cur |= ((value >>> i) & 1) << nbit;
      if (++nbit === 8) { bytes.push(cur); cur = 0; nbit = 0; }
    }
  };
  put(1, 1);  // BFINAL
  put(2, 2);  // BTYPE = dynamic Huffman
  put(0, 5);  // HLIT  -> 257 literal/length code lengths
  put(0, 5);  // HDIST -> 1 distance code length
  put(14, 4); // HCLEN -> 18 code-length code lengths
  // code-length lengths in clim order; only symbols 18 and 1 are present, at 1 bit
  for (const v of [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]) put(v, 3);
  const rep0 = (count: number) => { put(1, 1); put(count - 11, 7); }; // CL symbol 18
  const one = () => put(0, 1);                                        // CL symbol 1
  rep0(65); one(); rep0(138); rep0(52); one(); one(); // 65+1+190+1 lit/len + 1 dist
  for (let i = 0; i < n; ++i) put(0, 1); // literal 0x41
  put(1, 1);                             // EOB
  if (nbit) bytes.push(cur);
  return new Uint8Array(bytes);
};

test('decodes a long literal run without truncating', () => {
  const raw = craftLiteralRun(1e6);
  const expected = inflateRawSync(Buffer.from(raw));
  const got = inflateSync(raw);
  assert.is(got.length, expected.length);
  assert.ok(got.every(b => b === 0x41));
});

test.run();
