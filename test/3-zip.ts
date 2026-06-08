import { test } from 'uvu';
import * as assert from 'uvu/assert';
import {
  strToU8, strFromU8, zipSync, unzipSync, unzip
} from '../src/index';

const b2 = (d: Uint8Array, b: number) => d[b] | (d[b + 1] << 8);
const b4 = (d: Uint8Array, b: number) => (d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24)) >>> 0;
const w2 = (d: Uint8Array, b: number, v: number) => {
  d[b] = v & 255;
  d[b + 1] = (v >>> 8) & 255;
};

const rewriteZipMethod = (zip: Uint8Array, from: number, to: number) => {
  const out = new Uint8Array(zip);
  for (let i = 0; i < out.length - 4; ++i) {
    const sig = b4(out, i);
    if (sig === 0x04034b50) {
      if (b2(out, i + 8) === from) w2(out, i + 8, to);
      i += 30 + b2(out, i + 26) + b2(out, i + 28) - 1;
    } else if (sig === 0x02014b50) {
      if (b2(out, i + 10) === from) w2(out, i + 10, to);
      i += 46 + b2(out, i + 28) + b2(out, i + 30) + b2(out, i + 32) - 1;
    }
  }
  return out;
};

const w4 = (d: Uint8Array, b: number, v: number) => {
  d[b] = v & 255;
  d[b + 1] = (v >>> 8) & 255;
  d[b + 2] = (v >>> 16) & 255;
  d[b + 3] = (v >>> 24) & 255;
};

const rewriteZipOriginalSize = (zip: Uint8Array, size: number) => {
  const out = new Uint8Array(zip);
  for (let i = 0; i < out.length - 4; ++i) {
    const sig = b4(out, i);
    if (sig === 0x04034b50) {
      w4(out, i + 22, size);
      i += 30 + b2(out, i + 26) + b2(out, i + 28) - 1;
    } else if (sig === 0x02014b50) {
      w4(out, i + 24, size);
      i += 46 + b2(out, i + 28) + b2(out, i + 30) + b2(out, i + 32) - 1;
    }
  }
  return out;
};

const b64ToU8 = (b64: string) => Uint8Array.from(Buffer.from(b64, 'base64'));
const BZ2_SAMPLE = b64ToU8('QlpoOTFBWSZTWeopNX0AAAJTgAAQQAAEACJgDAAgADEGTEEBkeoEPEnfEAvF3JFOFCQ6ik1fQA==');

const zipStoredAsMethod = (name: string, payload: Uint8Array, method: number) => {
  const zipped = zipSync({ [name]: [payload, { level: 0 }] });
  return rewriteZipMethod(zipped, 0, method);
};

test('built-in BZIP2 decoder works for unzipSync (method 12)', () => {
  const z = zipStoredAsMethod('a.txt', BZ2_SAMPLE, 12);
  const out = unzipSync(z);
  assert.is(strFromU8(out['a.txt']), 'This is a test\n');
});

test('built-in BZIP2 decoder works for unzip (method 12)', async () => {
  const z = zipStoredAsMethod('a.txt', BZ2_SAMPLE, 12);
  const out = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
    unzip(z, (e, files) => {
      if (e) reject(e);
      else resolve(files);
    });
  });
  assert.is(strFromU8(out['a.txt']), 'This is a test\n');
});

test('built-in BZIP2 decoder uses async path for large original size metadata', async () => {
  const z = rewriteZipOriginalSize(zipStoredAsMethod('a.txt', BZ2_SAMPLE, 12), 300000);
  const out = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
    unzip(z, (e, files) => {
      if (e) reject(e);
      else resolve(files);
    });
  });
  assert.is(strFromU8(out['a.txt']), 'This is a test\n');
});

test.run();
