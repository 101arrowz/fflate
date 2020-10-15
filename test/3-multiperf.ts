import { testSuites } from './util';
import { deflateSync, inflateSync } from '..';
import { deflateRawSync, inflateRawSync } from 'zlib';
import { deflateRaw, inflateRaw } from 'pako';
import * as UZIP from 'uzip';
import * as tinf from 'tiny-inflate';
import { writeFileSync } from 'fs';
import { join } from 'path';

const cache: Record<string, Buffer> = {};

testSuites({
  'fflate compress 5x': file => {
    for (let i = 0; i < 5; ++i) deflateSync(file);
  },
  'fflate decompress 5x': (file, name, resetTimer) => {
    cache[name] = deflateRawSync(file), resetTimer();
    for (let i = 0; i < 5; ++i) {
      inflateSync(cache[name]);
    }
  },
  'pako compress 5x': file => {
    for (let i = 0; i < 5; ++i) deflateRaw(file);
  },
  'pako decompress 5x': (_, name) => {
    for (let i = 0; i < 5; ++i) inflateRaw(cache[name]);
  },
  'uzip compress 5x': file => {
    for (let i = 0; i < 5; ++i) UZIP.deflateRaw(file);
  },
  'uzip decompress 5x': (_, name) => {
    for (let i = 0; i < 5; ++i) UZIP.inflateRaw(cache[name]);
  },
  'tiny-inflate decompress 5x': (file, name) => {
    for (let i = 0; i < 5; ++i) tinf(cache[name], new Uint8Array(file.length));
  },
  'zlib compress 5x': file => {
    for (let i = 0; i < 5; ++i) deflateRawSync(file);
  },
  'zlib decompress 5x': (_, name) => {
    for (let i = 0; i < 5; ++i) inflateRawSync(cache[name]);
  }
}).then(perf => {
  writeFileSync(join(__dirname, 'results', 'multiTimings.json'), JSON.stringify(perf, null, 2));
})