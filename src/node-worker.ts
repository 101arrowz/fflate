// Mediocre shim
let Worker: typeof import('worker_threads').Worker;
let isMarkedAsUntransferable: typeof import('worker_threads').isMarkedAsUntransferable;
const workerAdd = ";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";

try {
  ({ Worker, isMarkedAsUntransferable } = require('worker_threads'));
} catch(e) {
}
export default Worker ? <T>(c: string, _: number, msg: unknown, transfer: ArrayBuffer[], cb: (err: Error, msg: T) => void) => {
  let done = false;
  const w = new Worker(c + workerAdd, { eval: true })
    .on('error', e => cb(e as Error, null))
    .on('message', m => cb(null, m))
    .on('exit', c => {
      if (c && !done) cb(new Error('exited with code ' + c), null);
    });
  if (isMarkedAsUntransferable) {
    // Pooled Node Buffers share an ArrayBuffer that is marked untransferable;
    // transferring it throws DataCloneError. Wrap postMessage so the transfer
    // list is filtered on every message (streaming pushes reuse it too, not
    // just this first send) and such buffers fall back to a structured clone.
    const pm = w.postMessage.bind(w) as typeof w.postMessage;
    w.postMessage = (m: unknown, t?: ArrayBuffer[]) =>
      pm(m, t && t.filter(b => !isMarkedAsUntransferable(b)));
  }
  w.postMessage(msg, transfer);
  w.terminate = () => {
    done = true;
    return Worker.prototype.terminate.call(w);
  }
  return w;
} : (_: string, __: number, ___: unknown, ____: ArrayBuffer[], cb: (err: Error, msg: null) => void) => {
  setImmediate(() => cb(new Error('async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)'), null));
  const NOP = () => {};
  return {
    terminate: NOP,
    postMessage: NOP
  } as unknown as import('worker_threads').Worker;
}