import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { inflateSync, inflateRawSync } from 'zlib';
import { Deflate, Zlib } from '../src/index';

// A seeded generator, so a failure names a reproducible case
const seeded = (seed: number) => {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
};

// Runs of zeros followed by repeats of the stream's opening bytes, in the first
// 32 KiB: the streaming compressor must not match into the unwritten zero
// prefix of its lookback buffer (a distance longer than the output so far,
// which zlib rejects as "invalid distance too far back")
const crafted = (seed: number) => {
  const rand = seeded(seed);
  const len = 64 + Math.floor(rand() * 4000);
  const opening = Array.from({ length: 3 + Math.floor(rand() * 6) }, () => rand() < 0.3 ? 0 : Math.floor(rand() * 4));
  const dat = new Uint8Array(len);
  dat.set(opening);
  for (let i = opening.length; i < len;) {
    const pick = rand();
    if (pick < 0.3) i += 1 + Math.floor(rand() * 8);
    else if (pick < 0.6) {
      i += Math.floor(rand() * 4);
      for (let k = 0; k < opening.length && i < len; ++k) dat[i++] = opening[k];
    } else dat[i++] = Math.floor(rand() * 4);
  }
  return { dat, level: (1 + Math.floor(rand() * 9)) as 1, step: 1 + Math.floor(rand() * 200) };
};

const stream = <T extends Deflate | Zlib>(make: (cb: (c: Uint8Array) => void) => T, dat: Uint8Array, step: number) => {
  const out: Uint8Array[] = [];
  const s = make(c => out.push(c));
  for (let i = 0; i < dat.length; i += step) s.push(dat.subarray(i, i + step));
  s.push(new Uint8Array(0), true);
  return Buffer.concat(out);
};

test('streaming Zlib never references data before the stream start', () => {
  for (let seed = 1; seed <= 400; ++seed) {
    const { dat, level, step } = crafted(seed);
    const out = stream(cb => new Zlib({ level }, cb), dat, step);
    assert.equal(new Uint8Array(inflateSync(out)), dat, `seed ${seed}`);
  }
});

test('streaming Deflate never references data before the stream start', () => {
  for (let seed = 401; seed <= 800; ++seed) {
    const { dat, level, step } = crafted(seed);
    const out = stream(cb => new Deflate({ level }, cb), dat, step);
    assert.equal(new Uint8Array(inflateRawSync(out)), dat, `seed ${seed}`);
  }
});

test('streaming Deflate with a dictionary still references the dictionary', () => {
  const dictionary = new TextEncoder().encode('the quick brown fox jumps over the lazy dog ');
  const dat = new TextEncoder().encode('the lazy dog jumps over the quick brown fox '.repeat(20));
  const out = stream(cb => new Deflate({ level: 9, dictionary }, cb), dat, 37);
  assert.equal(new Uint8Array(inflateRawSync(out, { dictionary })), dat);
  // the first bytes match into the dictionary, so the output is smaller than without one
  const plain = stream(cb => new Deflate({ level: 9 }, cb), dat, 37);
  assert.ok(out.length < plain.length);
});

test.run();
