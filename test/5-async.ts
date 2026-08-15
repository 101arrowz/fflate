import { Zip, AsyncZipDeflate, AsyncDeflate, unzipSync, inflateSync } from '..';
import * as assert from 'uvu/assert';
import { test } from 'uvu';

// Node's `Buffer.from` returns a view into a shared, pooled ArrayBuffer that
// Node marks as untransferable. Pushing such a Buffer into an async streaming
// class must not throw `DataCloneError: Cannot transfer object of unsupported
// type` (issue #278) — the transfer must degrade to a structured clone.
// A pooled buffer is one whose backing ArrayBuffer is larger than the view.
const pooled = Buffer.from('The quick brown fox jumps over the lazy dog. '.repeat(80));

test('AsyncZipDeflate accepts a pooled Node Buffer (#278)', async () => {
  assert.ok(pooled.buffer.byteLength > pooled.length, 'precondition: buffer is pooled');
  const zipped = await new Promise<Uint8Array>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    const z = new Zip((err, d, final) => {
      if (err) return reject(err);
      chunks.push(d.slice());
      if (final) {
        const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
        let off = 0;
        for (const c of chunks) out.set(c, off), off += c.length;
        resolve(out);
      }
    });
    const zd = new AsyncZipDeflate('a.bin', { level: 6 });
    z.add(zd);
    zd.push(pooled, true);
    z.end();
  });
  const unzipped = unzipSync(zipped);
  assert.equal(Array.from(unzipped['a.bin']), Array.from(pooled));
});

test('AsyncDeflate accepts a pooled Node Buffer (#278)', async () => {
  const deflated = await new Promise<Uint8Array>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    const d = new AsyncDeflate({ level: 6 }, (err, c, final) => {
      if (err) return reject(err);
      chunks.push(c.slice());
      if (final) {
        const out = new Uint8Array(chunks.reduce((n, x) => n + x.length, 0));
        let off = 0;
        for (const x of chunks) out.set(x, off), off += x.length;
        resolve(out);
      }
    });
    d.push(pooled, true);
  });
  assert.equal(Array.from(inflateSync(deflated)), Array.from(pooled));
});

test.run();
