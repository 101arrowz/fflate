import { existsSync, readFile, writeFile } from 'fs';
import { resolve } from 'path';
import { get } from 'https';
import { suite } from 'uvu';
import { performance } from 'perf_hooks';
import { Worker } from 'worker_threads';

const testFiles = {
  basic: Buffer.from('Hello world!'),
  text: 'https://www.gutenberg.org/files/2701/old/moby10b.txt',
  smallImage: 'https://hlevkin.com/hlevkin/TestImages/new/Rainier.bmp',
  image: 'https://www.hlevkin.com/hlevkin/TestImages/new/Maltese.bmp',
  largeImage: 'https://www.hlevkin.com/hlevkin/TestImages/new/Sunrise.bmp'
};

const testZipFiles = {
  model3D: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/kmz/Box.kmz',
  largeModel3D: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/3mf/truck.3mf'
};

const dlCached = async <T extends Record<string, string | Buffer>>(files: T) => {
  let res = {} as Record<keyof T, Buffer>;
  for (const name in files) {
    let data: string | Buffer = files[name];
    if (typeof data == 'string') {
      const fn = resolve(__dirname, 'data', name);
      if (!existsSync(fn)) {
        console.log('\nDownloading ' + data + '...');
        data = await new Promise((r, re) => get(data as string, res => {
          const len = +res.headers['content-length'];
          const buf = Buffer.allocUnsafe(len);
          let i = 0;
          res.on('data', chunk => {
            buf.set(chunk, i);
            console.log((100 * (i += chunk.length) / len).toFixed(1) + '%\x1B[1A');
          });
          res.on('error', re);
          res.on('end', () => {
            console.log('Complete');
            writeFile(fn, buf, () => r(buf));
          });
        }));
      } else {
        data = await new Promise((res, rej) => 
          readFile(fn, (err, buf) => err ? rej(err) : res(buf))
        );
      }
    }
    res[name as keyof T] = data as Buffer;
  }
  return res;
}

const testFilesPromise = dlCached(testFiles);
const testZipFilesPromise = dlCached(testZipFiles);

export type TestHandler = (file: Buffer, name: string, resetTimer: () => void) => unknown | Promise<unknown>;

export const testSuites = async <T extends Record<string, TestHandler>, D extends 'zip' | 'default' = 'default'>(suites: T, type?: D) => {
  type DK = keyof (D extends 'zip' ? typeof testZipFiles : typeof testFiles);
  const tf = type == 'zip' ? testZipFiles : testFiles;
  const tfp = type == 'zip' ? testZipFilesPromise : testFilesPromise;
  const perf = {} as Record<keyof T, Promise<Record<DK, number>>>;
  for (const k in suites) {
    perf[k] = new Promise(async setPerf => {
      const ste = suite(k);
      let localTestFiles: Record<DK, Buffer>;
      ste.before(async () => {
        localTestFiles = (await tfp) as unknown as Record<DK, Buffer>;
      });
      const localPerf = {} as Record<DK, number>;
      for (const name in tf) {
        ste(name, async () => {
          let ts = performance.now();
          await suites[k](localTestFiles[name], name, () => {
            ts = performance.now();
          });
          localPerf[name] = performance.now() - ts;
        });
      }
      ste.after(() => {
        setPerf(localPerf);
      });
      ste.run();
    })
  }
  const resolvedPerf = {} as Record<keyof T, Record<DK, number>>;
  for (const k in suites) resolvedPerf[k] = await perf[k];
  return resolvedPerf;
};

export const stream = (src: Uint8Array, dst: {
  push(dat: Uint8Array, final: boolean): void;
}) => {
  for (let i = 0; i < src.length;) {
    const off = Math.floor(Math.random() * Math.min(131072, src.length >>> 3));
    dst.push(src.slice(i, i + off), (i += off) >= src.length);
  }
}

// create worker string
const cws = (pkg: string, method: string = '_cjsDefault') => `
  const ${method == '_cjsDefault' ? method : `{ ${method} }`} = require('${pkg}');
  const { Worker, workerData, parentPort } = require('worker_threads');
  try {
    const buf = ${method}(...(Array.isArray(workerData) ? workerData : [workerData]));
    parentPort.postMessage(buf, [buf.buffer]);
  } catch (err) {
    parentPort.postMessage({ err });
  }
`;

export type Workerized = (workerData: Uint8Array | [Uint8Array, {}], transferable?: ArrayBuffer[]) => WorkerizedResult;
export interface WorkerizedResult extends PromiseLike<Uint8Array> {
  timeout(ms: number): void;
};

// Worker creator
const wc = (pkg: string, method?: string): Workerized => {
  const str = cws(pkg, method);
  return (workerData, transferable) => {
    const worker = new Worker(str, {
      eval: true,
      workerData,
      transferList: transferable
    });
    let terminated = false;
    return {
      timeout(ms: number) {
        const tm = setTimeout(() => {
          worker.terminate();
          terminated = true;
        }, ms);
        worker.once('message', () => clearTimeout(tm));
      },
      then(res, rej) {
        return new Promise((res, rej) => {
          worker
            .once('message', msg => {
              if (msg.err) rej(msg.err);
              res(msg);
            })
            .once('error', rej)
            .once('exit', code => {
              if (terminated) rej(new Error('Timed out'));
              else if (code !== 0) rej(new Error('Exited with status code ' + code));
            });
        }).then(res, rej);
      }
    };
  }
}

const fflate = resolve(__dirname, '..');

export const workers = {
  fflate: {
    deflate: wc(fflate, 'deflateSync'),
    inflate: wc(fflate, 'inflateSync'),
    gzip: wc(fflate, 'gzipSync'),
    gunzip: wc(fflate, 'gunzipSync'),
    zlib: wc(fflate, 'zlibSync'),
    unzlib: wc(fflate, 'unzlibSync'),
    zip: wc(fflate, 'zipSync'),
    unzip: wc(fflate, 'unzipSync')
  },
  pako: {
    deflate: wc('pako', 'deflateRaw'),
    inflate: wc('pako', 'inflateRaw'),
    gzip: wc('pako', 'gzip'),
    gunzip: wc('pako', 'ungzip'),
    zlib: wc('pako', 'deflate'),
    unzlib: wc('pako', 'inflate')
  },
  uzip: {
    deflate: wc('uzip', 'deflateRaw'),
    inflate: wc('uzip', 'inflateRaw')
  },
  tinyInflate: {
    inflate: wc('tiny-inflate')
  },
  zlib: {
    deflate: wc('zlib', 'deflateRawSync'),
    inflate: wc('zlib', 'inflateRawSync'),
    gzip: wc('zlib', 'gzipSync'),
    gunzip: wc('zlib', 'gunzipSync'),
    zlib: wc('zlib', 'deflateSync'),
    unzlib: wc('zlib', 'inflateSync')
  }
};

export const bClone = (buf: Buffer) => {
  const clone = Buffer.allocUnsafe(buf.length);
  clone.set(buf);
  return clone;
}