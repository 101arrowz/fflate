import * as fflate from '../../../../';
import toNativeStream from './stream-adapter';

type Callback = (...args: unknown[]) => void;
type WorkerProxy = Record<string, Callback>;
const createWorkerProxy = (lib: string, keys: string[]): WorkerProxy => {
  const p: WorkerProxy = {};
  for (const k of keys) {
    const base = function(cb: (...args: unknown[]) => void) {
      const w = new Worker('../../util/workers.ts');
      w.postMessage([lib, k]);
      w.onmessage = function() {
        const args: unknown[] = Array.prototype.slice.call(arguments);
        args.unshift(null);
        cb.apply(null, args);
      }
      w.onerror = err => cb(err);
      return w;
    }
    if (k != 'zip' && k != 'unzip') {
      p[k] = function(dat, cb) {
        const w = base(cb as Callback);
        w.postMessage([dat, true], [(dat as Uint8Array).buffer]);
      }
      p['create' + k.slice(0, 1).toUpperCase() + k.slice(1)] = function() {
        let trueCb = arguments[0];
        const w = base((err, dat, final) => {
          trueCb(err, dat, final);
        });
        const out = {
          ondata: undefined,
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
        const w = base(arguments[arguments.length - 1]);
        const bufs: ArrayBuffer[] = [];
        for (const k in arguments[0]) {
          bufs.push((arguments[k] = new Uint8Array(arguments[k])).buffer);
        }
        w.postMessage(Array.prototype.slice.call(arguments, 0, -1), bufs);
      }
    }
  }
  return p;
}

const keys = ['zip', 'unzip', 'deflate', 'inflate', 'gzip', 'gunzip', 'zlib', 'unzlib'];

const uzipWorker = createWorkerProxy('uzip', keys);
const pakoWorker = createWorkerProxy('pako', keys);
const fr = new FileReader();
const fileToU8 = (file: File, cb: (out: Uint8Array) => void) => {
  fr.onload = () => {
    cb(new Uint8Array(fr.result as ArrayBuffer));
  }
  fr.readAsArrayBuffer(file);
};

const exec = (code: string, files: File[], callback: Callback): unknown => {
  const scope = {
    fflate,
    uzipWorker,
    pakoWorker,
    toNativeStream,
    callback,
    fileToU8,
    files
  };
  return new Function('"use strict";' + Object.keys(scope).map(k => 'var ' + k + ' = this["' + k + '"];').join('') + code).call(scope);
}

export default exec;