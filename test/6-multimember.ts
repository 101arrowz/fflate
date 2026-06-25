import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { gzipSync as nodeGzip, gunzipSync as nodeGunzip } from 'zlib';
import { gunzipSync, decompressSync, Gunzip } from '..';

// RFC 1952 section 2.2: a gzip file consists of a series of members; all of
// them must be decoded and concatenated. fflate's streaming Gunzip already
// does this; gunzipSync (and decompressSync, which routes to it) must too.
const multimember = suite('multi-member gzip (sync)');

const concat = (...parts: Buffer[]) => Buffer.concat(parts);

multimember('gunzipSync decodes a two-member stream', () => {
  const input = concat(nodeGzip(Buffer.from('AAAAAAAA')), nodeGzip(Buffer.from('BB')));
  // Oracle: node zlib decodes the full concatenation.
  assert.equal(Buffer.from(nodeGunzip(input)).toString(), 'AAAAAAAABB');
  assert.equal(Buffer.from(gunzipSync(input)).toString(), 'AAAAAAAABB');
});

multimember('gunzipSync matches the streaming Gunzip on many members', () => {
  const parts: Buffer[] = [];
  const chunks: string[] = [];
  for (let i = 0; i < 5; ++i) {
    const s = 'member-' + i + '-payload';
    chunks.push(s);
    parts.push(nodeGzip(Buffer.from(s)));
  }
  const input = concat(...parts);
  const expected = chunks.join('');

  assert.equal(Buffer.from(nodeGunzip(input)).toString(), expected);
  assert.equal(Buffer.from(gunzipSync(input)).toString(), expected);

  // fflate's own streaming path is already correct; sync must agree with it.
  const acc: Buffer[] = [];
  const g = new Gunzip(chunk => acc.push(Buffer.from(chunk)));
  g.push(input, true);
  assert.equal(Buffer.concat(acc).toString(), expected);
});

multimember('decompressSync handles multi-member gzip', () => {
  const input = concat(nodeGzip(Buffer.from('hello ')), nodeGzip(Buffer.from('world')));
  assert.equal(Buffer.from(decompressSync(input)).toString(), 'hello world');
});

multimember('single-member gunzipSync still works', () => {
  const input = nodeGzip(Buffer.from('just one member'));
  assert.equal(Buffer.from(gunzipSync(input)).toString(), 'just one member');
});

multimember.run();
