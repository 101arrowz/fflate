const u8 = Uint8Array, u16 = Uint16Array;

// fixed lengths
const fl = new u16([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, /* unused */ 258, 258, /* impossible */ 258]);

// fixed length extra bits
// yes, this can be calculated, but hardcoding is more efficient
const fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);

// fixed distances
const fd = new u16([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, /* unused */ 32768, 32768]);

// fixed distance extra bits
// see fleb note
const fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 13, 13]);

// code length index map
const clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);

// map of value to reverse (assuming 16 bits)
const rev = new u16(32768);
for (let i = 0; i < 32768; ++i) {
  // reverse table algorithm from UZIP.js
  let x = i;
  x = ((x & 0xaaaaaaaa) >>> 1) | ((x & 0x55555555) << 1);
  x = ((x & 0xcccccccc) >>> 2) | ((x & 0x33333333) << 2);
  x = ((x & 0xf0f0f0f0) >>> 4) | ((x & 0x0f0f0f0f) << 4);
  rev[i] = ((x & 0xff00ff00) >>> 8) | ((x & 0x00ff00ff) << 8);
}

// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
const hTree = (cd: Uint8Array, mb: number) => {
  // index
  let i = 0;
  // u8 "map": index -> # of codes with bit length = index
  const l = new u8(mb);
  // length of cd must be 288 (total # of codes)
  for (; i < cd.length; ++i) ++l[cd[i] - 1];
  // u16 "map": index -> minimum code for bit length = index
  const le = new u16(mb);
  for (i = 0; i < mb; ++i) {
    le[i] = (le[i - 1] + l[i - 1]) << 1;
  }
  // u16 "map": index -> number of actual bits, symbol for code
  const co = new u16(1 << mb);
  for (i = 0; i < cd.length; ++i) {
    // ignore 0 lengths
    if (cd[i]) {
      // num encoding both symbol and bits read
      const sv = (i << 4) | cd[i];
      // free bits
      const r = mb - cd[i];
      // bits to remove for reverser
      const rvb = 16 - mb;
      // start value
      let v = le[cd[i] - 1]++ << r;
      // m is end value
      for (const m = v | ((1 << r) - 1); v <= m; ++v) {
        // every 16 bit value starting with the code yields the same result
        co[rev[v] >>> rvb] = sv;
      }
    }
  }
  return co;
}

// fixed length tree
const flt = new u8(288);
for (let i = 0; i < 144; ++i) flt[i] = 8;
for (let i = 144; i < 256; ++i) flt[i] = 9;
for (let i = 256; i < 280; ++i) flt[i] = 7;
for (let i = 280; i < 288; ++i) flt[i] = 8;
// fixed distance tree
const fdt = new u8(32);
for (let i = 0; i < 32; ++i) fdt[i] = 5;
// fixed length map
const flm = hTree(flt, 9);
// fixed distance map
const fdm = hTree(fdt, 5);
// fixed length mask
const fml = (1 << 9) - 1;
// fixed dist mask
const fmd = (1 << 5) - 1;

// find max of array
const max = (a: Uint8Array) => {
  let m = a[0];
  for (let i = 0; i < a.length; ++i) {
    if (a[i] > m) m = a[i];
  }
  return m;
};

// read d, starting at bit p continuing for l bits
const bits = (d: Uint8Array, p: number, l: number) => {
  const o = p >>> 3;
  return ((d[o] | (d[o + 1] << 8)) >>> (p & 7)) & ((1 << l) - 1);
}

// read d, starting at bit p continuing for at least 16 bits
const bits16 = (d: Uint8Array, p: number) => {
  const o = p >>> 3;
  return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)) >>> (p & 7));
}

// maximum chunk size (practically, theoretically infinite)
const MC = 1 << 17;

// expands raw DEFLATE data
const inflate = (dat: Uint8Array, buf?: Uint8Array) => {
  // have to estimate size
  const noBuf = buf == null;
  // Slightly less than 2x - assumes ~60% compression ratio
  if (noBuf) buf = new u8((dat.length >>> 2) << 3);
  // ensure buffer can fit at least l elements
  const cbuf = (l: number) => {
    let bl = buf.length;
    // need to increase size to fit
    if (l > bl) {
      // Double or set to necessary, whichever is greater
      const nbuf = new u8(Math.max(bl << 1, l));
      nbuf.set(buf);
      buf = nbuf;
    }
  }
  //  last chunk     chunktype literal   dist       lengths    lmask   dmask
  let final = false, type = 0, hLit = 0, hDist = 0, hcLen = 0, ml = 0, md = 0;
  //  bitpos   bytes
  let pos = 0, bt = 0;
  //  len                dist
  let lm: Uint16Array, dm: Uint16Array;
  while (!final) {
    // BFINAL - this is only 1 when last chunk is next
    final = bits(dat, pos, 1) as unknown as boolean;
    // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
    type = bits(dat, pos + 1, 2);
    pos += 3;
    if (!type) {
      // go to end of byte boundary
      if (pos & 7) pos += 8 - (pos & 7);
      const s = (pos >>> 3) + 4, l = dat[s - 4] | (dat[s - 3] << 8);
      // ensure size
      if (noBuf) cbuf(bt + l);
      // Copy over uncompressed data
      buf.set(dat.subarray(s, s + l), bt);
      // Get new bitpos, update byte count
      pos = (s + l) << 3, bt += l;
      continue;
    }
    // Make sure the buffer can hold this + the largest possible addition
    if (noBuf) cbuf(bt + MC);
    if (type == 1) {
      lm = flm;
      dm = fdm;
      ml = fml;
      md = fmd;
    }
    else if (type == 2) {
      hLit = bits(dat, pos, 5) + 257;
      hDist = bits(dat, pos + 5, 5) + 1;
      hcLen = bits(dat, pos + 10, 4) + 4;
      pos += 14;
      // length+distance tree
      const ldt = new u8(hLit + hDist);
      // code length tree
      const clt = new u8(19);
      for (let i = 0; i < hcLen; ++i) {
        // use index map to get real code
        clt[clim[i]] = bits(dat, pos + i * 3, 3);
      }
      pos += hcLen * 3;
      // code lengths bits
      const clb = max(clt);
      // code lengths map
      const clm = hTree(clt, clb);
      for (let i = 0; i < ldt.length;) {
        const r = clm[bits(dat, pos, clb)];
        // bits read
        pos += r & 15;
        // symbol
        const s = r >>> 4;
        // code length to copy
        if (s < 16) {
          ldt[i++] = s;
        } else {
          //  copy   count
          let c = 0, n = 0;
          if (s == 16) n = 3 + bits(dat, pos, 2), pos += 2, c = ldt[i - 1];
          else if (s == 17) n = 3 + bits(dat, pos, 3), pos += 3;
          else if (s == 18) n = 11 + bits(dat, pos, 7), pos += 7;
          while (n--) ldt[i++] = c;
        }
      }
      //    length tree                 distance tree
      const lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
      // max length bits
      const mlb = max(lt)
      // max dist bits
      const mdb = max(dt);
      ml = (1 << mlb) - 1;
      lm = hTree(lt, mlb);
      md = (1 << mdb) - 1;
      dm = hTree(dt, mdb);
    }
    while (1) {
      // bits read, code
      const c = lm[bits16(dat, pos) & ml];
      pos += c & 15;
      // code
      const sym = c >>> 4;
      if (sym < 256) buf[bt++] = sym;
      else if (sym == 256) break;
      else {
        let end = bt + sym - 254;
        // no extra bits needed if less
        if (sym > 264) {
          // index
          const i = sym - 257;
          end = bt + bits(dat, pos, fleb[i]) + fl[i];
          pos += fleb[i];
        }
        // dist
        const d = dm[bits16(dat, pos) & md];
        pos += d & 15;
        const dsym = d >>> 4;
        let dt = fd[dsym];
        if (dsym > 3) {
          dt += bits16(dat, pos) & ((1 << fdeb[dsym]) - 1);
          pos += fdeb[dsym];
        }
        if (noBuf) cbuf(bt + MC);
        while (bt < end) {
          buf[bt] = buf[bt++ - dt];
          buf[bt] = buf[bt++ - dt];
          buf[bt] = buf[bt++ - dt];
          buf[bt] = buf[bt++ - dt];
        }
        bt = end;
      }
    }
  }
  return buf.slice(0, bt);
}


export { inflate };