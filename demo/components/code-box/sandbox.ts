import * as fflate from '../../..';
import toNativeStream from './stream-adapter';

type Callback = (...args: unknown[]) => void;
type WorkerProxy = Record<string, Callback>;
const concat = (chunks: Uint8Array[]) => {
  const out = new Uint8Array(
    chunks.reduce((a, v) => v.length + a, 0)
  );
  let loc = 0;
  for (const chunk of chunks) {
    out.set(chunk, loc);
    loc += chunk.length;
  }
  return out;
}
const createWorkerProxy = (lib: string, keys: string[]): WorkerProxy => {
  const p: WorkerProxy = {};
  for (const k of keys) {
    const base = function(cb: (...args: unknown[]) => void) {
      const w = new Worker('../../util/workers.ts');
      w.postMessage([lib, k]);
      w.onmessage = function(msg) {
        const args = msg.data;
        args.unshift(null);
        cb.apply(null, args);
      }
      w.onerror = err => cb(err);
      return w;
    }
    if (k != 'zip' && k != 'unzip') {
      p[k] = function(dat, cb) {
        const chks: unknown[] = [];
        const w = base((err, dat, final) => {
          if (err) (cb as Callback)(err);
          else {
            if (final) {
              if (!chks.length) (cb as Callback)(null, dat);
              else (cb as Callback)(null, concat(chks as Uint8Array[]));
            } else chks.push(dat);
          }
        });
        w.postMessage([dat, true], [(dat as Uint8Array).buffer]);
      }
      p['create' + k.slice(0, 1).toUpperCase() + k.slice(1)] = function() {
        let trueCb = arguments[0];
        const w = base((err, dat, final) => {
          trueCb(err, dat, final);
        });
        const out = {
          ondata: trueCb,
          push(v: Uint8Array, f: boolean) {
            if (!out.ondata) throw 'no callback';
            trueCb = out.ondata;
            w.postMessage([v, f], [v.buffer]);
          },
          terminate() {
            w.terminate();
          }
        }
        return out;
      }
    } else {
      p[k] = function() {
        let trueCb = arguments[0];
        const w = base((err, dat) => {
          trueCb(err, dat);
        });
        const out = {
          ondata: trueCb,
          add(name: string, buf: Uint8Array) { 
            buf = new Uint8Array(buf);
            w.postMessage([name, buf], [buf.buffer]);
          },
          end() {
            if (!out.ondata) throw 'no callback';
            trueCb = out.ondata;
            w.postMessage(null);
          }
        }
        return out;
      }
    }
  }
  return p;
}

const keys = ['zip', 'unzip', 'deflate', 'inflate', 'gzip', 'gunzip', 'zlib', 'unzlib'];

const uzipWorker = createWorkerProxy('uzip', keys);
const pakoWorker = createWorkerProxy('pako', keys);
const fileToU8 = (file: File, cb: (out: Uint8Array) => void) => {
  const fr = new FileReader();
  fr.onloadend = () => {
    cb(new Uint8Array(fr.result as ArrayBuffer));
  }
  fr.readAsArrayBuffer(file);
};

const download = (file: BlobPart, name?: string) => {
  const url = URL.createObjectURL(new Blob([file]));
  const dl = document.createElement('a');
  dl.download = name || ('fflate-demo-' + Date.now() + '.dat');
  dl.href = url;
  dl.click();
  URL.revokeObjectURL(url);
}

const bts = ['B', ' kB', ' MB', ' GB'];

const hrbt = (bt: number) => {
  let i = 0;
  for (; bt > 1023; ++i) bt /= 1024;
  return bt.toFixed((i != 0) as unknown as number) + bts[i];
}

const prettySizes = (files: Record<string, [number, number]>) => {
  let out = '\n\n';
  let tot = 0;
  let totc = 0;
  let cnt = 0;
  for (const k in files) {
    ++cnt;
    out += '<span style="font-weight:bold">' + k + '</span> compressed from <span style="font-weight:bold;color:red">' + hrbt(files[k][1]) + '</span> to <span style="font-weight:bold;color:green">' + hrbt(files[k][0]) + '</span>\n';
    totc += files[k][0];
    tot += files[k][1];
  }
  return out + (cnt > 1 ? '\n\n<span style="font-weight:bold">In total, all files originally <span style="font-style:italic;color:red">' + hrbt(tot) + '</span>, compressed to <span style="font-style:italic;color:green">' + hrbt(totc) + '</span></span>' : '');
}

const exec = (code: string, files: File[], callback: Callback) => {
  const scope = {
    fflate,
    uzipWorker,
    pakoWorker,
    toNativeStream,
    callback,
    fileToU8,
    files,
    download,
    prettySizes
  };
  try {
    new Function('"use strict";' + Object.keys(scope).map(k => 'var ' + k + ' = this["' + k + '"];').join('') + code).call(scope);
  } catch(e) {
    callback(e);
  }
}

export default exec;