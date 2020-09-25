import { testSuites, workers, bClone } from './util';
import * as assert from 'uvu/assert';

// Name is to ensure that this runs first
// Note that workers are not used here to optimize performance but rather
// to prevent infinite loops from hanging the process.
testSuites({
  async compression(file) {
    const fileClone = bClone(file);
    const cProm = workers.fflate.deflate(fileClone, [fileClone.buffer]);
    cProm.timeout(10000);
    const buf = await cProm;
    assert.ok(file.equals(await workers.zlib.inflate(buf, [buf.buffer])));
  },
  async decompression(file) {
    const fileClone = bClone(file);
    const data = await workers.zlib.deflate(fileClone, [fileClone.buffer]);
    const dProm = workers.fflate.inflate(data, [data.buffer]);
    dProm.timeout(5000);
    assert.ok(file.equals(await dProm));
  }
});