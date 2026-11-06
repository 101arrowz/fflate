import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { unzipSync, unzip, zipSync, strToU8, strFromU8, FlateError, Unzipped, UnzipFileInfo } from '../src/index';
import { craftZip, CraftEntry } from './zipcraft';

// Malformed ZIP headers must be rejected before anything is allocated from the
// sizes they declare, and valid ZIP64 entries must be read even without a
// ZIP64 end of central directory record.

const text = 'hello fflate '.repeat(1000);
const payload = strToU8(text);

const unzipAsync = (data: Uint8Array, filter?: (f: UnzipFileInfo) => boolean) =>
  new Promise<Unzipped>((res, rej) => unzip(data, { filter }, (err, files) => err ? rej(err) : res(files)));

const expectInvalid = async (entry: CraftEntry, opts?: { zip64Eocd?: boolean }) => {
  const zip = craftZip([entry], opts);
  try {
    unzipSync(zip);
    assert.unreachable('unzipSync should throw');
  } catch (e) {
    assert.is((e as FlateError).code, 13);
  }
  try {
    await unzipAsync(zip);
    assert.unreachable('unzip should fail');
  } catch (e) {
    assert.is((e as FlateError).code, 13);
  }
};

const headers = suite('zip headers');

headers('rejects an uncompressed size beyond the DEFLATE expansion limit', async () => {
  await expectInvalid({ name: 'a.txt', data: payload, cdUncompressedSize: 1073741824 });
});

headers('rejects a ZIP64 uncompressed size beyond the DEFLATE expansion limit', async () => {
  await expectInvalid({
    name: 'a.txt', data: payload,
    cdUncompressedSize: 0xFFFFFFFF,
    zip64Extra: { uncompressedSize: 2 ** 40 }
  }, { zip64Eocd: true });
});

headers('rejects a compressed size that points past the end of the archive', async () => {
  await expectInvalid({ name: 'a.txt', data: payload, cdCompressedSize: 50000000 });
  await expectInvalid({ name: 'a.txt', data: payload, method: 0, cdCompressedSize: 50000000 });
});

headers('rejects ZIP64 size sentinels without a ZIP64 extra field', async () => {
  await expectInvalid({ name: 'a.txt', data: payload, cdUncompressedSize: 0xFFFFFFFF });
});

headers('reads ZIP64 extra fields without a ZIP64 end of central directory record', async () => {
  const zip = craftZip([{
    name: 'a.txt', data: payload,
    cdCompressedSize: 0xFFFFFFFF, cdUncompressedSize: 0xFFFFFFFF,
    zip64Extra: { uncompressedSize: 'auto', compressedSize: 'auto' }
  }]);
  let seen: UnzipFileInfo;
  const sync = unzipSync(zip, { filter: f => (seen = f, true) });
  assert.is(seen.originalSize, payload.length);
  assert.ok(seen.size < payload.length);
  assert.is(strFromU8(sync['a.txt']), text);
  const async = await unzipAsync(zip);
  assert.is(strFromU8(async['a.txt']), text);
});

headers('still extracts valid archives, including highly compressible data', async () => {
  const zeros = new Uint8Array(10 << 20);
  const zip = zipSync({
    'a.txt': payload,
    'stored.txt': [payload, { level: 0 }],
    'zeros.bin': [zeros, { level: 9 }],
    'empty.txt': new Uint8Array(0)
  });
  for (const files of [unzipSync(zip), await unzipAsync(zip)]) {
    assert.is(strFromU8(files['a.txt']), text);
    assert.is(strFromU8(files['stored.txt']), text);
    assert.is(files['zeros.bin'].length, zeros.length);
    assert.ok(files['zeros.bin'].every(b => b == 0));
    assert.is(files['empty.txt'].length, 0);
  }
});

headers('skips validation for entries rejected by the filter', () => {
  const zip = craftZip([
    { name: 'bad.txt', data: payload, cdUncompressedSize: 1073741824 },
    { name: 'good.txt', data: payload }
  ]);
  const files = unzipSync(zip, { filter: f => f.name != 'bad.txt' });
  assert.equal(Object.keys(files), ['good.txt']);
});

headers.run();
