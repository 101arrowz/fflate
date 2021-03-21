const ch2: Record<string, string> = {};

let durl = (c: string) => URL.createObjectURL(new Blob([c], { type: 'text/javascript' }));

try {
  URL.revokeObjectURL(durl(''));
} catch(e) {
  durl = c => 'data:application/javascript;charset=UTF-8,' + encodeURI(c);
}

export default <T>(c: string, id: number, msg: unknown, transfer: ArrayBuffer[], cb: (err: Error, msg: T) => void) => {
  const w = new Worker(ch2[id] ||= durl(c));
  w.onerror = e => cb(e.error, null);
  w.onmessage = e => cb(null, e.data);
  w.postMessage(msg, transfer);
  return w;
}