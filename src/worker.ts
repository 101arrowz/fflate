const ch2: Record<string, string> = {};

export default <T>(c: string, id: number, msg: unknown, transfer: ArrayBuffer[], cb: (err: Error, msg: T) => void) => {
  const w = new Worker(ch2[id] ||= URL.createObjectURL(
    new Blob([
      c + ';addEventListener("error",function(e){e=e.error;postMessage([e.message,e.code,e.stack])})'
    ], { type: 'text/javascript' })
  ));
  w.onmessage = e => {
    const d = e.data;
    if (Array.isArray(d)) {
      const err = new Error(d[0]);
      err['code'] = d[1];
      // if Error#stack DNE, still undefined
      err.stack = d[2];
      cb(err, null);
    } else cb(null, d);
  }
  w.postMessage(msg, transfer);
  return w;
}