import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { join } from 'path';
import { runInNewContext } from 'vm';
import { gzipSync, deflateRawSync } from 'zlib';
import { minify } from 'terser';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import type * as Fflate from '../src';

const test = suite('async worker scope');
const entry = join(__dirname, '..', 'lib', 'index.cjs');
const input = new Uint8Array(1024);
for (let i = 0; i < input.length; ++i) input[i] = i & 255;

const minified = async (name: string) => {
  const output = await minify(readFileSync(entry, 'utf8'), {
    mangle: { toplevel: true },
    compress: { passes: 5, unsafe: true, pure_getters: true },
    // Force collisions rather than relying on a particular minifier's name order.
    nameCache: { vars: { props: { $pbf: name } } }
  });
  const exports = {};
  runInNewContext(output.code!, { exports, require: createRequire(entry) });
  return exports as typeof Fflate;
};

const decode = (fn: typeof Fflate.inflate, data: Uint8Array) => new Promise<Uint8Array>((resolve, reject) => {
  let terminate: Fflate.AsyncTerminable;
  const timeout = setTimeout(() => {
    terminate();
    reject(new Error('Worker did not complete'));
  }, 5000);
  try {
    terminate = fn(data, (err, result) => {
      clearTimeout(timeout);
      if (err) reject(err);
      else resolve(result);
    });
  } catch (err) {
    clearTimeout(timeout);
    reject(err);
  }
});

const check = async (fflate: typeof Fflate) => {
  assert.equal(Array.from(await decode(fflate.inflate, deflateRawSync(input))), Array.from(input));
  assert.equal(Array.from(await decode(fflate.gunzip, gzipSync(input))), Array.from(input));
};

test('unminified workers', async () => {
  await check(require(entry));
});

for (const name of ['k', 'e']) {
  test('minified worker dependency named ' + name, async () => {
    await check(await minified(name));
  });
}

test.run();
