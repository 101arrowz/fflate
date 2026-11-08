import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { inflateRawSync, gunzipSync, inflateSync } from 'zlib';
import {
  deflateSync, gzipSync, zlibSync, Deflate, Gzip, Zlib,
  deflate, gzip, zlib, AsyncDeflate, AsyncGzip, AsyncZlib,
  DeflateOptions
} from '..';

const test = suite('level 0 stored blocks');
const sizes = [0, 1, 65534, 65535, 65536, 131069, 131070, 131071, 196605];
const formats = [
  { name: 'raw', sync: deflateSync, stream: Deflate, async: deflate, asyncStream: AsyncDeflate, decode: inflateRawSync, header: 0, trailer: 0 },
  { name: 'gzip', sync: gzipSync, stream: Gzip, async: gzip, asyncStream: AsyncGzip, decode: gunzipSync, header: 10, trailer: 8 },
  { name: 'zlib', sync: zlibSync, stream: Zlib, async: zlib, asyncStream: AsyncZlib, decode: inflateSync, header: 2, trailer: 4 }
];

const input = (size: number) => {
  const data = new Uint8Array(size);
  for (let i = 0; i < size; ++i) data[i] = (i * 31 + (i >>> 8)) & 255;
  return data;
};

const check = (format: typeof formats[number], compressed: Uint8Array, data: Uint8Array, opts: DeflateOptions) => {
  assert.ok(format.decode(compressed, opts).equals(Buffer.from(data)));
  // Raw inflate accepts trailing bytes, so also require the final stored block
  // to end exactly where the wrapper's checksum (if any) begins.
  let pos = format.header + (format.name == 'zlib' && opts.dictionary ? 4 : 0);
  let final = false;
  while (!final) {
    assert.ok(pos + 5 <= compressed.length - format.trailer);
    const header = compressed[pos++];
    assert.is(header & 6, 0);
    final = !!(header & 1);
    const len = compressed[pos] | (compressed[pos + 1] << 8);
    const nlen = compressed[pos + 2] | (compressed[pos + 3] << 8);
    assert.is(len ^ nlen, 65535);
    pos += 4 + len;
  }
  assert.is(pos, compressed.length - format.trailer);
};

for (const format of formats) {
  for (const size of sizes) {
    test(format.name + ' sync ' + size, () => {
      const data = input(size), opts: DeflateOptions = { level: 0 };
      check(format, format.sync(data, opts), data, opts);
    });

    test(format.name + ' streaming ' + size, () => {
      const data = input(size), opts: DeflateOptions = { level: 0 };
      const splits = [[size], [0, size], [size, 0]];
      if (size) splits.push([1, size - 1]);
      if (size >= 65535) splits.push([65535, size - 65535]);
      for (const split of splits) {
        const chunks: Uint8Array[] = [];
        let finals = 0, pos = 0;
        const stream = new format.stream(opts, (chunk, final) => {
          chunks.push(chunk);
          if (final) ++finals;
        });
        split.forEach((len, i) => {
          stream.push(data.subarray(pos, pos += len), i == split.length - 1);
        });
        assert.is(finals, 1);
        check(format, Buffer.concat(chunks), data, opts);
      }
    });
  }

  for (const size of [0, 65535, 131070]) {
    test(format.name + ' async ' + size, async () => {
      const data = input(size), opts: DeflateOptions = { level: 0 };
      const compressed = await new Promise<Uint8Array>((resolve, reject) => {
        format.async(data, opts, (err, result) => err ? reject(err) : resolve(result));
      });
      check(format, compressed, data, opts);
    });

    test(format.name + ' async streaming ' + size, async () => {
      const data = input(size), opts: DeflateOptions = { level: 0 };
      const compressed = await new Promise<Uint8Array>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        const stream = new format.asyncStream(opts, (err, chunk, final) => {
          if (err) return reject(err);
          chunks.push(chunk);
          if (final) resolve(Buffer.concat(chunks));
        });
        stream.push(data.slice(), true);
      });
      check(format, compressed, data, opts);
    });

    if (format.name != 'gzip') {
      for (const dictSize of [1, 32768, 65535]) {
        test(format.name + ' dictionary ' + dictSize + ', input ' + size, () => {
          const data = input(size);
          const opts: DeflateOptions = { level: 0, dictionary: input(dictSize) };
          check(format, format.sync(data, opts), data, opts);
          const chunks: Uint8Array[] = [];
          const stream = new format.stream(opts, chunk => chunks.push(chunk));
          stream.push(data, true);
          check(format, Buffer.concat(chunks), data, opts);
        });
      }
    }
  }
}

test.run();
