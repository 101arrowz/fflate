// Mediocre shim
import { FlateCallback } from '.';
import { Worker } from 'worker_threads';
const workerAdd = ";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)};self=global";
export default (c: string, msg: unknown, transfer: ArrayBuffer[], cb: FlateCallback) => {
  let done = false;
  const cb2: typeof cb = (e, d) => {
    done = true;
    wk.terminate();
    cb(e, d);
  }
  const wk = new Worker(c + workerAdd, { eval: true })
    .on('error', e => cb2(e, null))
    .on('message', m => cb2(null, m))
    .on('exit', c => {
      if (!done) cb2(new Error('Exited with code ' + c), null);
    });
  wk.postMessage(msg, transfer);
  return () => { done = true; wk.terminate(); }
}