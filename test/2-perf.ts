import { testSuites, workers, bClone, TestHandler } from './util';
import { writeFileSync } from 'fs';
import { join } from 'path';

const preprocessors = {
  inflate: workers.zlib.deflate,
  gunzip: workers.zlib.gzip,
  unzlib: workers.zlib.zlib
};

const cache: Record<string, Record<string, Buffer>> = {
  deflate: {},
  inflate: {},
  gzip: {},
  gunzip: {},
  zlib: {},
  unzlib: {}
};

const flattenedWorkers: Record<string, TestHandler> = {};
for (const k in workers) {
  for (const l in workers[k]) {
    flattenedWorkers[k + '.' + l] = async (file, name, resetTimer) => {
      const fileClone = bClone(file);
      let buf = fileClone;
      if (preprocessors[l]) {
        buf = bClone(cache[l][name] ||= Buffer.from(
          await preprocessors[l as keyof typeof preprocessors](buf, [buf.buffer])
        ));
        resetTimer();
      }
      const opt2 = preprocessors[l]
        ? k === 'tinyInflate'
          ? new Uint8Array(file.length)
          : null
        : { level: 1 };
      await workers[k][l]([buf, opt2], opt2 instanceof Uint8Array
        ? [buf.buffer, opt2.buffer]
        : [buf.buffer]);
    }
  }
}

testSuites(flattenedWorkers).then(perf => {
  writeFileSync(join(__dirname, 'results', 'timings.json'), JSON.stringify(perf, null, 2));
});