import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { zip, unzip } from '../lib/node.cjs';

const asyncZip = suite('Async ZIP filenames');

for (const [size, level] of [[32, 0], [32, 6], [600000, 6]] as const) {
  asyncZip(`preserves __proto__ (${size} bytes, level ${level})`, async () => {
    const content = new Uint8Array(size).fill(65);
    const input = Object.create(null);
    input['__proto__'] = content;
    input['normal.txt'] = content;
    input['nested/__proto__'] = content;
    const archive = await new Promise<Uint8Array>((resolve, reject) => {
      zip(input, { level }, (err, data) => err ? reject(err) : resolve(data));
    });
    // This size and ratio exercise unzip's real worker path.
    if (size > 524288) assert.ok(archive.length < size * 0.8);
    const files = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
      unzip(archive, (err, data) => err ? reject(err) : resolve(data));
    });
    assert.is(Object.getPrototypeOf(files), Object.prototype);
    assert.equal(Object.keys(files).sort(), ['__proto__', 'nested/__proto__', 'normal.txt']);
    for (const name of Object.keys(input)) assert.equal(files[name], content);
    assert.equal(Object.getOwnPropertyDescriptor(files, '__proto__'), {
      value: content, writable: true, enumerable: true, configurable: true
    });
    const filtered = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
      unzip(archive, { filter: file => file.name !== '__proto__' },
        (err, data) => err ? reject(err) : resolve(data));
    });
    assert.equal(Object.keys(filtered).sort(), ['nested/__proto__', 'normal.txt']);
    assert.is(Object.getPrototypeOf(filtered), Object.prototype);
  });
}

asyncZip.run();
