import { testSuites, workers, bClone } from './util';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { performance } from 'perf_hooks';
import * as assert from 'uvu/assert';

const sizePerf: Record<string, Record<string, [number, number]>> = {};

testSuites({
  async main(file, name) {
    sizePerf[name] = {};
    for (const lib of (['fflate', 'pako', 'uzip', 'zlib'] as const)) {
      const clone = bClone(file);
      const ts = performance.now();
      sizePerf[name][lib] = [(await workers[lib].deflate([clone, { level: 9 }], [clone.buffer])).length, performance.now() - ts];
    }
    for (const lib of ['pako', 'uzip', 'zlib']) {
      // Less than 5% larger
      assert.ok(((sizePerf[name].fflate[0] - sizePerf[name][lib][0]) / sizePerf[name][lib][0]) < 0.05);
    }
  }
}).then(() => {
  writeFileSync(join(__dirname, 'results', 'longTimings.json'), JSON.stringify(sizePerf, null, 2));
})