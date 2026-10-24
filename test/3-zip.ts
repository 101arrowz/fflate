import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import JSZip = require('jszip');
import { zipSync, unzipSync, strToU8 } from '../lib/node.cjs';

const zip = suite('ZIP filenames');
const content = strToU8('a file named __proto__');

for (const level of [0, 6] as const) {
  zip(`preserves own __proto__ filenames at level ${level}`, async () => {
    const nested = Object.create(null);
    nested['__proto__'] = content;
    const input = Object.defineProperty({ 'normal.txt': content, nested }, '__proto__', {
      value: content, enumerable: true
    });
    const archive = zipSync(input, { level });
    const files = unzipSync(archive);
    assert.is(Object.getPrototypeOf(files), Object.prototype);
    assert.equal(Object.keys(files).sort(), ['__proto__', 'nested/', 'nested/__proto__', 'normal.txt']);
    assert.equal(files['__proto__'], content);
    assert.equal(files['nested/__proto__'], content);
    assert.equal(files['normal.txt'], content);

    const external = await JSZip.loadAsync(archive);
    assert.equal(await external.file('__proto__').async('uint8array'), content);
  });
}

zip('reads an external __proto__ entry without changing the result prototype', async () => {
  const archive = await new JSZip()
    .file('__proto__', content)
    .file('normal.txt', content)
    .generateAsync({ type: 'uint8array' });
  const files = unzipSync(archive);
  assert.is(Object.getPrototypeOf(files), Object.prototype);
  assert.equal(Object.getOwnPropertyDescriptor(files, '__proto__'), {
    value: content, writable: true, enumerable: true, configurable: true
  });
  const filtered = unzipSync(archive, { filter: file => file.name !== '__proto__' });
  assert.equal(Object.keys(filtered), ['normal.txt']);
  assert.is(Object.getPrototypeOf(filtered), Object.prototype);
});

zip.run();
