// Helpers to build hand-crafted ZIP archives for testing header parsing.
// Every size and offset field can be overridden so malformed archives can be produced.
import { deflateSync, strToU8 } from '../src/index';

export interface CraftEntry {
  name: string;
  data: Uint8Array;
  // compress with DEFLATE (8) or store (0)
  method?: 0 | 8;
  // override the sizes written into the central directory (32-bit fields)
  cdCompressedSize?: number;
  cdUncompressedSize?: number;
  // ZIP64 extra field (id 0x0001) appended to the central directory entry
  // 'auto' writes the real value
  zip64Extra?: { uncompressedSize?: number | 'auto'; compressedSize?: number | 'auto' };
}

export interface CraftOptions {
  // write a ZIP64 end of central directory record + locator
  zip64Eocd?: boolean;
}

const w2 = (b: number[], v: number) => { b.push(v & 255, (v >>> 8) & 255); };
const w4 = (b: number[], v: number) => { w2(b, v & 65535); w2(b, (v >>> 16) & 65535); };
const w8 = (b: number[], v: number) => { w4(b, v % 4294967296); w4(b, Math.floor(v / 4294967296)); };

export const craftZip = (entries: CraftEntry[], opts: CraftOptions = {}) => {
  const out: number[] = [];
  const cd: number[] = [];
  for (const e of entries) {
    const method = e.method == null ? 8 : e.method;
    const body = method == 8 ? deflateSync(e.data) : e.data;
    const fn = strToU8(e.name);
    const lho = out.length;
    // local file header
    w4(out, 0x4034B50); w2(out, 20); w2(out, 0); w2(out, method);
    w2(out, 0); w2(out, 0); w4(out, 0);
    w4(out, body.length); w4(out, e.data.length);
    w2(out, fn.length); w2(out, 0);
    out.push(...fn, ...body);
    // ZIP64 extra field for the central directory
    const ex: number[] = [];
    if (e.zip64Extra) {
      const z = e.zip64Extra;
      const fields: number[] = [];
      if (z.uncompressedSize != null) w8(fields, z.uncompressedSize == 'auto' ? e.data.length : z.uncompressedSize);
      if (z.compressedSize != null) w8(fields, z.compressedSize == 'auto' ? body.length : z.compressedSize);
      w2(ex, 1); w2(ex, fields.length); ex.push(...fields);
    }
    // central directory file header
    w4(cd, 0x2014B50); w2(cd, 45); w2(cd, 45); w2(cd, 0); w2(cd, method);
    w2(cd, 0); w2(cd, 0); w4(cd, 0);
    w4(cd, e.cdCompressedSize == null ? body.length : e.cdCompressedSize);
    w4(cd, e.cdUncompressedSize == null ? e.data.length : e.cdUncompressedSize);
    w2(cd, fn.length); w2(cd, ex.length); w2(cd, 0); w2(cd, 0); w2(cd, 0);
    w4(cd, 0); w4(cd, lho);
    cd.push(...fn, ...ex);
  }
  const cdo = out.length;
  out.push(...cd);
  if (opts.zip64Eocd) {
    const z64o = out.length;
    // ZIP64 end of central directory record
    w4(out, 0x6064B50); w8(out, 44); w2(out, 45); w2(out, 45); w4(out, 0); w4(out, 0);
    w8(out, entries.length); w8(out, entries.length); w8(out, cd.length); w8(out, cdo);
    // ZIP64 end of central directory locator
    w4(out, 0x7064B50); w4(out, 0); w8(out, z64o); w4(out, 1);
  }
  // end of central directory record
  w4(out, 0x6054B50); w2(out, 0); w2(out, 0);
  w2(out, entries.length); w2(out, entries.length);
  w4(out, cd.length); w4(out, cdo); w2(out, 0);
  return new Uint8Array(out);
};
