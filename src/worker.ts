const ch2: Record<string, string> = {};

let durl = (c: string) => URL.createObjectURL(new Blob([c], { type: 'text/javascript' }));
let cwk = (u: string) => new Worker(u);

try {
  URL.revokeObjectURL(durl(''));
} catch(e) {
  // We're in Deno or a very old browser
  durl = c => 'data:application/javascript;charset=UTF-8,' + encodeURI(c);
  // If Deno, this is necessary; if not, this changes nothing
  cwk = u => new Worker(u, { type: 'module' });
}

export default <T>(c: string, id: number, msg: unknown, transfer: ArrayBuffer[], cb: (err: Error, msg: T) => void) => {
  const w = cwk(ch2[id] ||= durl(c));
  w.onerror = e => cb(e.error, null);
  w.onmessage = e => cb(null, e.data);
  w.postMessage(msg, transfer);
  return w;
}