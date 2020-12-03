import pako from 'pako';
import * as UZIP from 'uzip';
import JSZip from 'jszip';

const wk = self as unknown as {
  postMessage(b: unknown, bufs: ArrayBuffer[]): void;
};

const dcmp = ['inflate', 'gunzip', 'unzlib'];

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

// CRC32 table
const crct = new Uint32Array(256);
for (let i = 0; i < 256; ++i) {
  let c = i, k = 9;
  while (--k) c = ((c & 1) && 0xEDB88320) ^ (c >>> 1);
  crct[i] = c;
}

// CRC32
const crc = (d: Uint8Array) => {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < d.length; ++i) c = crct[(c & 255) ^ d[i]] ^ (c >>> 8);
  return c ^ 0xFFFFFFFF;
}

const uzGzip = (d: Uint8Array) => {
  const raw = UZIP.deflateRaw(d);
  const head = new Uint8Array([31, 139, 8, 0, 0, 0, 0, 0, 0, 0]);
  const c = crc(d);
  const l = raw.length;
  const tail = new Uint8Array([
    c & 255, (c >>> 8) & 255, (c >>> 16) & 255, (c >>> 32) & 255,
    l & 255, (l >>> 8) & 255, (l >>> 16) & 255, (l >>> 32) & 255,
  ]);
  return concat([head, raw, tail]);
}

onmessage = (ev: MessageEvent<[string, string]>) => {
  const [lib, type] = ev.data;
  if (lib == 'pako') {
    if (type == 'zip') {
      const zip = new JSZip();
      onmessage = (ev: MessageEvent<null | [string, Uint8Array]>) => {
        if (ev.data) {
          zip.file(ev.data[0], ev.data[1]);
        } else zip.generateAsync({
          type: 'uint8array',
          compressionOptions: { level: 6 }
        }).then(buf => {
          wk.postMessage([buf, true], [buf.buffer]);
        })
      };
    } else if (type == 'unzip') {
      onmessage = (ev: MessageEvent<Uint8Array>) => {
        JSZip.loadAsync(ev.data).then(zip => {
          const out: Record<string, Uint8Array> = {};
          const bufs: Promise<ArrayBuffer>[] = [];
          for (const k in zip.files) {
            const file = zip.files[k];
            bufs.push(file.async('uint8array').then(v => {
              out[file.name] = v;
              return v.buffer;
            }));
          }
          Promise.all(bufs).then(res => {
            wk.postMessage([out, true], res);
          });
        })
      }
    } else {
      const strm = dcmp.indexOf(type) == -1
      ? new pako.Deflate(type == 'gzip' ? {
          gzip: true
        } : {
          raw: type == 'inflate'
        }
      ) : new pako.Inflate({
        raw: type == 'deflate'
      });
      let chk: Uint8Array;
      strm.onData = (chunk: Uint8Array) => {
        if (chk) wk.postMessage([chk, false], [chk.buffer]);
        chk = chunk;
      };
      onmessage = (ev: MessageEvent<[Uint8Array, boolean]>) => {
        strm.push(ev.data[0], ev.data[1]);
        if (ev.data[1]) wk.postMessage([chk, true], [chk.buffer]);
      };
    }
  } else if (lib == 'uzip') {
    if (type == 'zip') {
      const zip: Record<string, Uint8Array> = {};
      onmessage = (ev: MessageEvent<null | [string, Uint8Array]>) => {
        if (ev.data) {
          zip[ev.data[0]] = ev.data[1];
        } else {
          const buf = UZIP.encode(zip);
          wk.postMessage([new Uint8Array(buf), true], [buf]);
        }
      };
    } else if (type == 'unzip') {
      onmessage = (ev: MessageEvent<Uint8Array>) => {
        const bufs = UZIP.parse(ev.data.buffer);
        const outBufs: ArrayBuffer[] = [];
        for (const k in bufs) {
          outBufs.push(bufs[k]);
          bufs[k] = new Uint8Array(bufs[k]);
        }
        wk.postMessage([bufs, true], outBufs);
      }
    } else {
      const chunks: Uint8Array[] = [];
      onmessage = (ev: MessageEvent<[Uint8Array, boolean]>) => {
        chunks.push(ev.data[0]);
        if (ev.data[1]) {
          const out = concat(chunks);
          const buf = type == 'inflate'
            ? UZIP.inflateRaw(out)
            : type == 'deflate'
              ? UZIP.deflateRaw(out)
              : type == 'zlib'
                ? UZIP.deflate(out)
                : type == 'unzlib'
                  ? UZIP.inflate(out)
                  : type == 'gzip'
                    ? uzGzip(out)
                    // we can pray that there's no special header
                    : UZIP.inflateRaw(out.subarray(10, -8));
          wk.postMessage([buf, true], [buf.buffer]);
        }
      }
    }
  }
}