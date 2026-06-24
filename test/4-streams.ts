import { Deflate, Inflate } from '..';
import * as assert from 'uvu/assert';
import { test } from 'uvu';
import { inflateRawSync } from 'zlib';

const enc = (s: string) => new TextEncoder().encode(s);

const concat = (chunks: Uint8Array[]): Uint8Array => {
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let off = 0;
  for (const chunk of chunks) {
    out.set(chunk, off);
    off += chunk.length;
  }
  return out;
};

// Compress a sequence of frames through a single Deflate stream, calling
// flush(true) after each so every frame is independently decompressible while
// still reusing the shared compression window (a "snapshot + deltas" stream).
const syncFlushSlices = (frames: Uint8Array[]): Uint8Array[] => {
  let captured: Uint8Array[] = [];
  const deflate = new Deflate({ level: 6 });
  deflate.ondata = (chunk) => captured.push(chunk.slice());
  return frames.map((frame) => {
    captured = [];
    deflate.push(frame, false);
    deflate.flush(true);
    return concat(captured);
  });
};

// fflate's own streaming inflate must recover each frame from its slice.
const fflateRoundTrips = (frames: Uint8Array[]): boolean => {
  const slices = syncFlushSlices(frames);
  let inflated: Uint8Array[] = [];
  const inflate = new Inflate();
  inflate.ondata = (chunk) => inflated.push(chunk);
  return slices.every((slice, i) => {
    inflated = [];
    inflate.push(slice, false);
    const got = concat(inflated);
    return got.length === frames[i].length && got.every((b, j) => b === frames[i][j]);
  });
};

// A spec-compliant inflater (Node's zlib) must accept the concatenated stream.
// After the trailing sync marker the stream is byte-aligned, so a final empty
// stored block (01 00 00 ff ff) lets inflateRawSync terminate cleanly.
const referenceDecodes = (frames: Uint8Array[]): boolean => {
  const full = concat([...syncFlushSlices(frames), new Uint8Array([1, 0, 0, 255, 255])]);
  const got = inflateRawSync(Buffer.from(full));
  return got.equals(Buffer.concat(frames.map((f) => Buffer.from(f))));
};

// Regression test for a sync-flush corruption bug. When a deflated block ended
// at a bit position with `(r & 7) == 6`, flush(true) wrote the empty stored
// block's LEN/NLEN one byte too early (wfblk only reserved 2 header bits for the
// 3-bit BFINAL+BTYPE header), so the 00 00 ff ff sync marker was bit-misaligned.
// fflate's own inflate happened to mask it, but spec-compliant decoders rejected
// the following block with "invalid stored block lengths".
test('flush(true) produces a spec-valid stream that round-trips', () => {
  // Minimal trigger: "0000" deflates to a literal + a (len 3, dist 1) match
  // ending at the bad bit alignment; the following frame then fails to decode.
  assert.ok(referenceDecodes([enc('0000'), enc('')]), 'reference decode of ["0000", ""]');
  assert.ok(fflateRoundTrips([enc('0000'), enc('')]), 'fflate round-trip of ["0000", ""]');

  // The real-world case that surfaced this (nested JSON snapshot + deltas).
  const group = [
    '{"video":{"renditions":{"v0":{"codec":"avc1.64001f","bitrate":6000000},"v1":{"codec":"avc1.640015","bitrate":3000000}}},"audio":{"renditions":{"a0":{"codec":"opus","bitrate":128000}}}}',
    '{"video":{"renditions":{"v0":{"bitrate":6200000}}}}',
    '{"video":{"renditions":{"v0":{"bitrate":5800000}}}}',
    '{"audio":{"renditions":{"a0":{"bitrate":96000}}}}'
  ].map(enc);
  assert.ok(referenceDecodes(group), 'reference decode of JSON group');
  assert.ok(fflateRoundTrips(group), 'fflate round-trip of JSON group');

  // Sweep a range of repeated-byte lengths that hit assorted block bit
  // alignments (4..11 zeros previously corrupted; 3 and 12+ did not).
  for (let n = 1; n <= 40; n++) {
    const frames = [enc('0'.repeat(n)), enc('')];
    assert.ok(referenceDecodes(frames), `reference decode of ${n} zeros`);
    assert.ok(fflateRoundTrips(frames), `fflate round-trip of ${n} zeros`);
  }
});

test.run();
