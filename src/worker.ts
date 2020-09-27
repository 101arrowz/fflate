import { FlateCallback } from '.';

export default (c: string, msg: unknown, transfer: ArrayBuffer[], cb: FlateCallback) => {
  const u = URL.createObjectURL(new Blob([c], { type: 'text/javascript' }));
  const w = new Worker(u);
  const cb2: typeof cb = (e, d) => {
    w.terminate();
    URL.revokeObjectURL(u);
    cb(e, d);
  }
  w.onerror = e => cb2(e.error, null);
  w.onmessage = e => cb2(null, e.data);
  w.postMessage(msg, transfer);
}