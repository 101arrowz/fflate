// TODO: test ZIP

import { testSuites } from './util';
import * as assert from 'uvu/assert';
import { zipSync, unzipSync, zip, unzip, Zip, ZipPassThrough } from '../src';
import type { Zippable, Unzipped } from '../src';

const b4 = (d: Uint8Array, b: number) =>
  d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24);

testSuites({
  zip64_supports_more_than_65535_files_zipSync() {
    const data: Zippable = {};
    for (let i = 0; i < 65536; ++i) {
      data[i + '.txt'] = new Uint8Array(0);
    }
    const zipped = zipSync(data, { level: 0 });
    assert.ok(b4(zipped, zipped.length - 98) == 0x06064b50);
    assert.ok(b4(zipped, zipped.length - 42) == 0x07064b50);
    assert.ok(b4(zipped, zipped.length - 22) == 0x06054b50);
    assert.ok(Object.keys(unzipSync(zipped)).length == 65536);
  },
  async zip64_supports_more_than_65535_files_zip() {
    const data: Zippable = {};
    for (let i = 0; i < 65536; ++i) {
      data[i + '.txt'] = new Uint8Array(0);
    }
    const zipped = await new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
      zip(data, { level: 0 }, (err, result) => err ? reject(err) : resolve(result));
    });
    assert.ok(b4(zipped, zipped.length - 98) == 0x06064b50);
    assert.ok(b4(zipped, zipped.length - 42) == 0x07064b50);
    assert.ok(b4(zipped, zipped.length - 22) == 0x06054b50);
    const unzipped = await new Promise<Unzipped>((resolve, reject) => {
      unzip(zipped, (err, result) => err ? reject(err) : resolve(result));
    });
    assert.ok(Object.keys(unzipped).length == 65536);
  },
  zip64_supports_more_than_65535_files_streaming_Zip() {
    const chunks: Uint8Array[] = [];
    const zip = new Zip((err, dat, final) => {
      if (err) throw err;
      if (dat) chunks.push(dat);
    });

    for (let i = 0; i < 65536; ++i) {
      const f = new ZipPassThrough(i + '.txt');
      zip.add(f);
      f.push(new Uint8Array(0), true);
    }

    zip.end();

    let len = 0;
    for (const c of chunks) len += c.length;

    const zipped = new Uint8Array(len);
    let off = 0;
    for (const c of chunks) {
      zipped.set(c, off);
      off += c.length;
    }

    assert.ok(b4(zipped, zipped.length - 98) == 0x06064b50);
    assert.ok(b4(zipped, zipped.length - 42) == 0x07064b50);
    assert.ok(b4(zipped, zipped.length - 22) == 0x06054b50);
    assert.ok(Object.keys(unzipSync(zipped)).length == 65536);
  }
});
