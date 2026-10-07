import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { strToU8, unzip, unzipSync, zipSync } from '../src/index';

const test = suite('ZIP64 entry sizes');
const contents = strToU8('ZIP64 entry without a ZIP64 end record');

// Replace selected central-directory fields with ZIP64 extra-field values.
const entryZip64 = (fields: number) => {
  const zip = zipSync({ 'entry.txt': contents });
  const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  const end = zip.length - 22;
  const central = view.getUint32(end + 16, true);
  const extra = new Uint8Array(4 + 8 * [1, 2, 4].filter(bit => fields & bit).length);
  const extraView = new DataView(extra.buffer);
  extraView.setUint16(0, 1, true);
  extraView.setUint16(2, extra.length - 4, true);
  let pos = 4;
  for (const [bit, offset] of [[1, 24], [2, 20], [4, 42]]) {
    if (fields & bit) {
      extraView.setUint32(pos, view.getUint32(central + offset, true), true);
      view.setUint32(central + offset, 0xFFFFFFFF, true);
      pos += 8;
    }
  }
  view.setUint16(central + 6, 45, true);
  view.setUint16(central + 30, extra.length, true);
  view.setUint32(end + 12, view.getUint32(end + 12, true) + extra.length, true);
  const result = new Uint8Array(zip.length + extra.length);
  result.set(zip.subarray(0, end));
  result.set(extra, end);
  result.set(zip.subarray(end), end + extra.length);
  return result;
};

for (const fields of [1, 2, 3, 4, 7]) {
  test(`extracts entry fields ${fields} in sync and async APIs`, async () => {
    const zip = entryZip64(fields);
    // Assert metadata before extraction, so a regression cannot allocate 4 GiB.
    const options = { filter: (file: { size: number; originalSize: number }) => {
      assert.is(file.originalSize, contents.length);
      assert.ok(file.size < zip.length);
      return true;
    } };
    assert.equal(unzipSync(zip, options)['entry.txt'], contents);
    await new Promise<void>((resolve, reject) => {
      unzip(zip, options, (error, files) => {
        if (error) return reject(error);
        try {
          assert.equal(files['entry.txt'], contents);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });
}

test.run();
