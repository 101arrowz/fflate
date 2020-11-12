// Mediocre shim
import { Worker } from 'worker_threads';

const workerAdd = ";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";

export default <T>(c: string, _: number, msg: unknown, transfer: ArrayBuffer[], cb: (err: Error, msg: T) => void) => {
  let done = false;
  const w = new Worker(c + workerAdd, { eval: true })
    .on('error', e => cb(e, null))
    .on('message', m => cb(null, m))
    .on('exit', c => {
      if (c && !done) cb(new Error('Exited with code ' + c), null);
    });
  w.postMessage(msg, transfer);
  w.terminate = () => {
    done = true;
    return Worker.prototype.terminate.call(w);
  }
  return w;
}