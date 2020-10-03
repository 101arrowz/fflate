// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951

// Much of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// Many optimizations have been made, so the bundle size is ultimately smaller but performance is similar.

// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).

import wk from './node-worker';

// aliases for shorter compressed code (most minifers don't do this)
const u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;

// fixed length extra bits
const fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);

// fixed distance extra bits
// see fleb note
const fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);

// code length index map
const clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);

// get base, reverse index map from extra bits
const freb = (eb: Uint8Array, start: number) => {
  const b = new u16(31);
  for (let i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  // numbers here are at max 18 bits
  const r = new u32(b[30]);
  for (let i = 1; i < 30; ++i) {
    for (let j = b[i]; j < b[i + 1]; ++j) {
      r[j] = ((j - b[i]) << 5) | i;
    }
  }
  return [b, r] as const;
}

const [fl, revfl] = freb(fleb, 2);
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
const [fd, revfd] = freb(fdeb, 0);

// map of value to reverse (assuming 16 bits)
const rev = new u16(32768);
for (let i = 0; i < 32768; ++i) {
  // reverse table algorithm from UZIP.js
  let x = i;
  x = ((x & 0xAAAAAAAA) >>> 1) | ((x & 0x55555555) << 1);
  x = ((x & 0xCCCCCCCC) >>> 2) | ((x & 0x33333333) << 2);
  x = ((x & 0xF0F0F0F0) >>> 4) | ((x & 0x0F0F0F0F) << 4);
  rev[i] = (((x & 0xFF00FF00) >>> 8) | ((x & 0x00FF00FF) << 8)) >>> 1;
}

// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
const hMap = ((cd: Uint8Array, mb: number, r: 0 | 1) => {
  const s = cd.length;
  // index
  let i = 0;
  // u8 "map": index -> # of codes with bit length = index
  const l = new u8(mb);
  // length of cd must be 288 (total # of codes)
  for (; i < s; ++i) ++l[cd[i] - 1];
  // u16 "map": index -> minimum code for bit length = index
  const le = new u16(mb);
  for (i = 0; i < mb; ++i) {
    le[i] = (le[i - 1] + l[i - 1]) << 1;
  }
  let co: Uint16Array;
  if (r) {
    co = new u16(s);
    for (i = 0; i < s; ++i) co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
  } else {
    // u16 "map": index -> number of actual bits, symbol for code
    co = new u16(1 << mb);
    // bits to remove for reverser
    const rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      // ignore 0 lengths
      if (cd[i]) {
        // num encoding both symbol and bits read
        const sv = (i << 4) | cd[i];
        // free bits
        const r = mb - cd[i];
        // start value
        let v = le[cd[i] - 1]++ << r;
        // m is end value
        for (const m = v | ((1 << r) - 1); v <= m; ++v) {
          // every 16 bit value starting with the code yields the same result
          co[rev[v] >>> rvb] = sv;
        }
      }
    }
  }
  return co;
});

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
const flm = hMap(flt, 9, 0), flnm = hMap(flt, 9, 1);
// fixed distance map
const fdm = hMap(fdt, 5, 0), fdnm = hMap(fdt, 5, 1);

// find max of array
const max = (a: Uint8Array | number[]) => {
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


// expands raw DEFLATE data
const inflt = (dat: Uint8Array, buf?: Uint8Array) => {
  // have to estimate size
  const noBuf = !buf;
  // Assumes roughly 33% compression ratio average
  if (noBuf) buf = new u8(dat.length * 3);
  // ensure buffer can fit at least l elements
  const cbuf = (l: number) => {
    let bl = buf.length;
    // need to increase size to fit
    if (l > bl) {
      // Double or set to necessary, whichever is greater
      const nbuf = new u8(Math.max(bl << 1, l));
      for (let i = 0; i < bl; ++i) nbuf[i] = buf[i];
      buf = nbuf;
    }
  }
  //  last chunk     chunktype literal   dist       lengths    lmask   dmask
  let final = 0, type = 0, hLit = 0, hDist = 0, hcLen = 0, ml = 0, md = 0;
  //  bitpos   bytes
  let pos = 0, bt = 0;
  //  len                dist
  let lm: Uint16Array, dm: Uint16Array;
  while (!final) {
    // BFINAL - this is only 1 when last chunk is next
    final = bits(dat, pos, 1);
    // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
    type = bits(dat, pos + 1, 2);
    pos += 3;
    if (!type) {
      // go to end of byte boundary
      if (pos & 7) pos += 8 - (pos & 7);
      let s = (pos >>> 3) + 4, l = dat[s - 4] | (dat[s - 3] << 8);
      // ensure size
      if (noBuf) cbuf(bt + l);
      // Copy over uncompressed data
      for (let m = s + l; s < m; ++s) buf[bt++] = dat[s];
      // Get new bitpos, update byte count
      pos = s << 3;
      continue;
    }
    // Make sure the buffer can hold this + the largest possible addition
    // maximum chunk size (practically, theoretically infinite) is 2^17;
    if (noBuf) cbuf(bt + 131072);
    if (type == 1) {
      lm = flm;
      dm = fdm;
      ml = 511;
      md = 31;
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
      const clm = hMap(clt, clb, 0);
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
      lm = hMap(lt, mlb, 0);
      md = (1 << mdb) - 1;
      dm = hMap(dt, mdb, 0);
    }
    for (;;) {
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
        if (noBuf) cbuf(bt + 131072);
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
  return bt == buf.length ? buf : buf.slice(0, bt);
}

// starting at p, write the minimum number of bits that can hold v to ds
const wbits = (d: Uint8Array, p: number, v: number) => {
  v <<= p & 7;
  const o = p >>> 3;
  d[o] |= v;
  d[o + 1] |= v >>> 8;
}

// starting at p, write the minimum number of bits (>8) that can hold v to ds
const wbits16 = (d: Uint8Array, p: number, v: number) => {
  v <<= p & 7;
  const o = p >>> 3;
  d[o] |= v;
  d[o + 1] |= v >>> 8;
  d[o + 2] |= v >>> 16;
}

type HuffNode = {
  // symbol
  s: number;
  // frequency
  f: number;
  // left child
  l?: HuffNode;
  // right child
  r?: HuffNode;
};

// creates code lengths from a frequency table
const hTree = (d: Uint16Array, mb: number) => {
  // Need extra info to make a tree
  const t: HuffNode[] = [];
  for (let i = 0; i < d.length; ++i) {
    if (d[i]) t.push({ s: i, f: d[i] });
  }
  const s = t.length;
  const t2 = t.slice();
  if (s == 0) return [new u8(0), 0] as const;
  if (s == 1) {
    const v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return [v, 1] as const;
  }
  t.sort((a, b) => a.f - b.f);
  // after i2 reaches last ind, will be stopped
  // freq must be greater than largest possible number of symbols
  t.push({ s: -1, f: 25001 });
  let l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
  t[0] = { s: -1, f: l.f + r.f, l, r };
  // efficient algorithm from UZIP.js
  // i0 is lookbehind, i2 is lookahead - after processing two low-freq
  // symbols that combined have high freq, will start processing i2 (high-freq,
  // non-composite) symbols instead
  // see https://reddit.com/r/photopea/comments/ikekht/uzipjs_questions/
	while (i1 != s - 1) {
    l = t[t[i0].f < t[i2].f ? i0++ : i2++];
    r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
    t[i1++] = { s: -1, f: l.f + r.f, l, r };
  }
  let maxSym = t2[0].s;
  for (let i = 1; i < s; ++i) {
    if (t2[i].s > maxSym) maxSym = t2[i].s;
  }
  // code lengths
  const tr = new u16(maxSym + 1);
  // max bits in tree
  let mbt = ln(t[i1 - 1], tr, 0);
  if (mbt > mb) {
    // more algorithms from UZIP.js
    // TODO: find out how this code works (debt)
    //  ind    debt
    let i = 0, dt = 0;
    //    left            cost
    const lft = mbt - mb, cst = 1 << lft;
    t2.sort((a, b) => tr[b.s] - tr[a.s] || a.f - b.f);
    for (; i < s; ++i) {
      const i2 = t2[i].s;
      if (tr[i2] > mb) {
        dt += cst - (1 << (mbt - tr[i2]));
        tr[i2] = mb;
      } else break;
    }
    dt >>>= lft;
    while (dt > 0) {
      const i2 = t2[i].s;
      if (tr[i2] < mb) dt -= 1 << (mb - tr[i2]++ - 1);
      else ++i;
    }
    for (; i >= 0 && dt; --i) {
      const i2 = t2[i].s;
      if (tr[i2] == mb) {
        --tr[i2];
        ++dt;
      }
    }
    mbt = mb;
  }
  return [new u8(tr), mbt] as const;
}
// get the max length and assign length codes
const ln = (n: HuffNode, l: Uint16Array, d: number): number => {
  return n.s == -1
    ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1))
    : (l[n.s] = d);
}

// length codes generation
const lc = (c: Uint8Array) => {
  let s = c.length;
  // Note that the semicolon was intentional
  while (s && !c[--s]);
  const cl = new u16(++s);
  //  ind      num         streak
  let cli = 0, cln = c[0], cls = 1;
  const w = (v: number) => { cl[cli++] = v; }
  for (let i = 1; i <= s; ++i) {
    if (c[i] == cln && i != s)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138) w(32754);
        if (cls > 2) {
          w(cls > 10 ? ((cls - 11) << 5) | 28690 : ((cls - 3) << 5) | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;
        for (; cls > 6; cls -= 6) w(8304);
        if (cls > 2) w(((cls - 3) << 5) | 8208), cls = 0;
      }
      while (cls--) w(cln);
      cls = 1;
      cln = c[i];
    }
  }
  return [cl.slice(0, cli), s] as const;
}

// calculate the length of output from tree, code lengths
const clen = (cf: Uint16Array, cl: Uint8Array) => {
  let l = 0;
  for (let i = 0; i < cl.length; ++i) l += cf[i] * cl[i];
  return l;
}

// writes a fixed block
// returns the new bit pos
const wfblk = (out: Uint8Array, pos: number, dat: Uint8Array) => {
  // no need to write 00 as type: TypedArray defaults to 0
  const s = dat.length;
  const o = (pos + 2) >>> 3;
  out[o + 1] = s & 255;
  out[o + 2] = s >>> 8;
  out[o + 3] = out[o + 1] ^ 255;
  out[o + 4] = out[o + 2] ^ 255;
  for (let i = 0; i < s; ++i) out[o + i + 5] = dat[i];
  return (o + 4 + s) << 3;
}

// writes a block
const wblk = (dat: Uint8Array, out: Uint8Array, final: number, syms: Uint32Array, lf: Uint16Array, df: Uint16Array, eb: number, li: number, bs: number, bl: number, p: number) => {
  wbits(out, p++, final);
  ++lf[256];
  const [dlt, mlb] = hTree(lf, 15);
  const [ddt, mdb] = hTree(df, 15);
  const [lclt, nlc] = lc(dlt);
  const [lcdt, ndc] = lc(ddt);
  const lcfreq = new u16(19);
  for (let i = 0; i < lclt.length; ++i) lcfreq[lclt[i] & 31]++;
  for (let i = 0; i < lcdt.length; ++i) lcfreq[lcdt[i] & 31]++;
  const [lct, mlcb] = hTree(lcfreq, 7);
  let nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc);
  const flen = (bl + 5) << 3;
  const ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  const dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
  if (flen < ftlen && flen < dtlen) return wfblk(out, p, dat.subarray(bs, bs + bl));
  let lm: Uint16Array, ll: Uint8Array, dm: Uint16Array, dl: Uint8Array;
  wbits(out, p, 1 + (dtlen < ftlen as unknown as number)), p += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 1), ll = dlt, dm = hMap(ddt, mdb, 1), dl = ddt;
    const llm = hMap(lct, mlcb, 1);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;
    for (let i = 0; i < nlcc; ++i) wbits(out, p + 3 * i, lct[clim[i]]);
    p += 3 * nlcc;
    const lcts = [lclt, lcdt];
    for (let it = 0; it < 2; ++it) {
      const clct = lcts[it];
      for (let i = 0; i < clct.length; ++i) {
        const len = clct[i] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15) wbits(out, p, (clct[i] >>> 5) & 127), p += clct[i] >>> 12;
      }
    }
  } else {
    lm = flnm, ll = flt, dm = fdnm, dl = fdt;
  }
  for (let i = 0; i < li; ++i) {
    if (syms[i] > 255) {
      const len = (syms[i] >>> 18) & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7) wbits(out, p, (syms[i] >>> 23) & 31), p += fleb[len];
      const dst = syms[i] & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3) wbits16(out, p, (syms[i] >>> 5) & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[syms[i]]), p += ll[syms[i]];
    }
  }
  wbits16(out, p, lm[256]);
  return p + ll[256];
}

// deflate options (nice << 13) | chain
const deo = new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);

// compresses data into a raw DEFLATE buffer
const dflt = (dat: Uint8Array, lvl: number, plvl: number, pre: number, post: number) => {
  const s = dat.length;
  const o = new u8(pre + s + 5 * Math.ceil(s / 7000) + post);
  // writing to this writes to the output buffer
  const w = o.subarray(pre, o.length - post);
  let pos = 0;
  if (!lvl || s < 8) {
    for (let i = 0; i < s; i += 65535) {
      // end
      const e = i + 65535;
      if (e < s) {
        // write full block
        pos = wfblk(w, pos, dat.subarray(i, e));
      } else {
        // write final block
        w[i] = 1;
        pos = wfblk(w, pos, dat.subarray(i, s));
      }
    }
  } else {
    const opt = deo[lvl - 1];
    const n = opt >>> 13, c = opt & 8191;
    const msk = (1 << plvl) - 1;
    //    prev 2-byte val map    curr 2-byte val map
    const prev = new u16(32768), head = new u16(msk + 1);
    const bs1 = Math.ceil(plvl / 3), bs2 = 2 * bs1;
    const hsh = (i: number) => (dat[i] ^ (dat[i + 1] << bs1) ^ (dat[i + 2] << bs2)) & msk;
    // 24576 is an arbitrary number of maximum symbols per block
    // 424 buffer for last block
    const syms = new u32(25000);
    // length/literal freq   distance freq
    const lf = new u16(288), df = new u16(32);
    //  l/lcnt  exbits  index  l/lind  waitdx  bitpos
    let lc = 0, eb = 0, i = 0, li = 0, wi = 0, bs = 0;
    for (; i < s; ++i) {
      // hash value
      const hv = hsh(i);
      // index mod 32768
      let imod = i & 32767;
      // previous index with this value
      let pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      // We always should modify head and prev, but only add symbols if
      // this data is not yet processed ("wait" for wait index)
      if (wi <= i) {
        // bytes remaining
        const rem = s - i;
        if ((lc > 7000 || li > 24576) && rem > 423) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
          li = lc = eb = 0, bs = i;
          for (let j = 0; j < 286; ++j) lf[j] = 0;
          for (let j = 0; j < 30; ++j) df[j] = 0;
        }
        //  len    dist   chain
        let l = 2, d = 0, ch = c, dif = (imod - pimod) & 32767;
        if (rem > 2 && hv == hsh(i - dif)) {
          const maxn = Math.min(n, rem);
          const maxd = Math.min(32767, i);
          // max possible length
          // not capped at dif because decompressors implement "rolling" index population
          const ml = Math.min(258, rem);
          while (dif <= maxd && --ch && imod != pimod) {
            if (dat[i + l] == dat[i + l - dif]) {
              let nl = 0;
              for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl);
              if (nl > l) {
                l = nl, d = dif;
                // break out early when we reach "nice" (we are satisfied enough)
                if (nl >= maxn) break;
                // now, find the rarest 2-byte sequence within this
                // length of literals and search for that instead.
                // Much faster than just using the start
                const mmd = Math.min(dif, nl - 2);
                let md = 0;
                for (let j = 0; j < mmd; ++j) {
                  const ti = (i - dif + j + 32768) & 32767;
                  const pti = prev[ti];
                  const cd = (ti - pti + 32768) & 32767;
                  if (cd > md) md = cd, pimod = ti;
                }
              }
            }
            // check the previous match
            imod = pimod, pimod = prev[imod];
            dif += (imod - pimod + 32768) & 32767;
          }
        }
        // d will be nonzero only when a match was found
        if (d) {
          // store both dist and len data in one Uint32
          // Make sure this is recognized as a len/dist with 28th bit (2^28)
          syms[li++] = 268435456 | (revfl[l] << 18) | revfd[d];
          const lin = revfl[l] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i + l;
          ++lc;
        } else {
          syms[li++] = dat[i];
          ++lf[dat[i]];
        }
      }
    }
    pos = wblk(dat, w, 1, syms, lf, df, eb, li, bs, i - bs, pos);
  }
  return o.slice(0, pre + (pos >>> 3) + 1 + post);
}


// CRC32 table
const crct = new u32(256);
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

// Adler32
const adler = (d: Uint8Array) => {
  let a = 1, b = 0, l = d.length;
  for (let i = 0; i != l;) {
    const e = Math.min(i + 5552, l);
    for (; i < e; ++i) a += d[i], b += a;
    a %= 65521, b %= 65521;
  }
  return (a & 255) << 24 | (a >>> 8) << 16 | (b & 255) << 8 | (b >>> 8);
}

/**
 * Options for compressing data into a DEFLATE format
 */
export interface DeflateOptions {
  /**
   * The level of compression to use, ranging from 0-9.
   * 
   * 0 will store the data without compression.
   * 1 is fastest but compresses the worst, 9 is slowest but compresses the best.
   * The default level is 6.
   * 
   * Typically, binary data benefits much more from higher values than text data.
   * In both cases, higher values usually take disproportionately longer than the reduction in final size that results.
   * 
   * For example, a 1 MB text file could:
   * - become 1.01 MB with level 0 in 1ms
   * - become 400 kB with level 1 in 10ms
   * - become 320 kB with level 9 in 100ms
   */
  level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * The memory level to use, ranging from 0-12. Increasing this increases speed and compression ratio at the cost of memory.
   * 
   * Note that this is exponential: while level 0 uses 4 kB, level 4 uses 64 kB, level 8 uses 1 MB, and level 12 uses 16 MB.
   * It is recommended not to lower the value below 4, since that tends to hurt performance.
   * In addition, values above 8 tend to help very little on most data and can even hurt performance.
   * 
   * The default value is automatically determined based on the size of the input data.
   */
  mem?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

/**
 * Options for compressing data into a GZIP format
 */
export interface GzipOptions extends DeflateOptions {
  /**
   * When the file was last modified. Defaults to the current time.
   * Set this to 0 to avoid specifying a modification date entirely.
   */
  mtime?: Date | string | number;
  /**
   * The filename of the data. If the `gunzip` command is used to decompress the data, it will output a file
   * with this name instead of the name of the compressed file.
   */
  filename?: string;
}

/**
 * Options for compressing data into a Zlib format
 */
export interface ZlibOptions extends DeflateOptions {}

/**
 * Callback for asynchronous (de)compression methods
 * @param err Any error that occurred
 * @param data The resulting data. Only present if `err` is null
 */
export type FlateCallback = (err: Error, data: Uint8Array) => unknown;

// async callback-based compression
interface AsyncOptions {
  /**
   * Whether or not to "consume" the source data. This will make the typed array/buffer you pass in
   * unusable but will increase performance and reduce memory usage.
   */
  consume?: boolean;
}

/**
 * Options for compressing data asynchronously into a DEFLATE format
 */
export interface AsyncDeflateOptions extends DeflateOptions, AsyncOptions {}

/**
 * Options for decompressing DEFLATE data asynchronously
 */
export interface AsyncInflateOptions extends AsyncOptions {
  /**
   * The original size of the data. Currently, the asynchronous API disallows
   * writing into a buffer you provide; the best you can do is provide the
   * size in bytes and be given back a new typed array.
   */
  size?: number;
}

/**
 * Options for compressing data asynchronously into a GZIP format
 */
export interface AsyncGzipOptions extends GzipOptions, AsyncOptions {}

/**
 * Options for decompressing GZIP data asynchronously
 */
export interface AsyncGunzipOptions extends AsyncOptions {}

/**
 * Options for compressing data asynchronously into a Zlib format
 */
export interface AsyncZlibOptions extends ZlibOptions, AsyncOptions {}

/**
 * Options for decompressing Zlib data asynchronously
 */
export interface AsyncUnzlibOptions extends AsyncInflateOptions {}

/**
 * A terminable compression/decompression process
 */
export interface AsyncTerminable {
  /**
   * Terminates the worker thread immediately. The callback will not be called.
   */
  (): void;
}

const gmem = (len: number, mem: number) => mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(len))) * 1.5) : (12 + mem);

// deflate with opts
const dopt = (dat: Uint8Array, opt: DeflateOptions = {}, pre: number, post: number) =>
  dflt(dat, opt.level == null ? 6 : opt.level, gmem(dat.length, opt.mem), pre, post);

// Walmart object spread
const mrg = <T extends {}>(a: T, b: T) => {
  const o = {} as T;
  for (const k in a) o[k] = a[k];
  for (const k in b) o[k] = b[k];
  return o;
}

// use a worker to execute code
const wrkr = (b: string, transfers: Record<string, Uint8Array | Uint16Array | Uint32Array>, dt: Uint8Array, ext: Record<string, unknown>, consume: boolean, cb: FlateCallback) => {
  const transferList = Object.keys(transfers).map(k => (transfers[k] = transfers[k].slice()).buffer);
  if (!consume) dt = new u8(dt);
  transferList.push(dt.buffer);
  transfers.dt = dt;
  return wk(b, mrg(transfers, ext), transferList, cb);
}

// I really, really wish there were a better way to do this than embedding terser'd JS as a string,
// but I can't find a way to do it without increasing bundle size.

// To create the string:
// 1: manually use only the necessary functions
// 2: find the names of every global variable that can be transfered
// 3: remove the globals, add them to the transfer

// async inflate
// TODO: make parameters the more similar to cbDflt
const cbInflt = (dat: Uint8Array, sz: number, consume: boolean, cb: FlateCallback) => 
  wrkr(
    'r=Uint8Array,n=Uint16Array,y=function(r){for(var n=r[0],a=0;a<r.length;++a)r[a]>n&&(n=r[a]);return n},b=function(r,n,a){var e=n>>>3;return(r[e]|r[e+1]<<8)>>>(7&n)&(1<<a)-1},x=function(r,n){var a=n>>>3;return(r[a]|r[a+1]<<8|r[a+2]<<16|r[a+3]<<24)>>>(7&n)},l=function(a,e){for(var f=a.length,t=0,o=new r(e);t<f;++t)++o[a[t]-1];var v=new n(e);for(t=0;t<e;++t)v[t]=v[t-1]+o[t-1]<<1;var l=new n(1<<e),b=15-e;for(t=0;t<f;++t)if(a[t])for(var u=t<<4|a[t],s=e-a[t],c=v[a[t]-1]++<<s,g=c|(1<<s)-1;c<=g;++c)l[i[c]>>>b]=u;return l},rn=function(n,o){for(var i,u,s=!o,c=new r(s?3*n.length:o),w=function(n){var a=c.length;if(n>a){for(var e=new r(Math.max(a<<1,n)),f=0;f<a;++f)e[f]=c[f];c=e}},d=0,k=0,m=0,A=0,M=0,U=0,j=0,p=0,z=0;!d;)if(d=b(n,p,1),k=b(n,p+1,2),p+=3,k){if(s&&w(z+131072),1==k)i=h,u=g,U=511,j=31;else if(2==k){m=b(n,p,5)+257,A=b(n,p+5,5)+1,M=b(n,p+10,4)+4,p+=14;for(var O=new r(m+A),q=new r(19),B=0;B<M;++B)q[f[B]]=b(n,p+3*B,3);p+=3*M;var C=y(q),D=l(q,C);for(B=0;B<O.length;){var E=D[b(n,p,C)];if(p+=15&E,(R=E>>>4)<16)O[B++]=R;else{var F=0,G=0;for(16==R?(G=3+b(n,p,2),p+=2,F=O[B-1]):17==R?(G=3+b(n,p,3),p+=3):18==R&&(G=11+b(n,p,7),p+=7);G--;)O[B++]=F}}var H=O.subarray(0,m),I=O.subarray(m),J=y(H),K=y(I);U=(1<<J)-1,i=l(H,J),j=(1<<K)-1,u=l(I,K)}for(;;){p+=15&(F=i[x(n,p)&U]);var L=F>>>4;if(L<256)c[z++]=L;else{if(256==L)break;var N=z+L-254;L>264&&(N=z+b(n,p,a[B=L-257])+v[B],p+=a[B]);var P=u[x(n,p)&j];p+=15&P;var Q=P>>>4;for(I=t[Q],Q>3&&(I+=x(n,p)&(1<<e[Q])-1,p+=e[Q]),s&&w(z+131072);z<N;)c[z]=c[z++-I],c[z]=c[z++-I],c[z]=c[z++-I],c[z]=c[z++-I];z=N}}}else{7&p&&(p+=8-(7&p));var R,S=n[(R=4+(p>>>3))-4]|n[R-3]<<8;s&&w(z+S);for(var T=R+S;R<T;++R)c[z++]=n[R];p=R<<3}return z==c.length?c:c.slice(0,z)},onmessage=function(r){for(var n in r.data)self[n]=r.data[n];n=rn(dt,sz);postMessage(n,[n.buffer])}',
    { a: fleb, e: fdeb, f: clim, v: fl, t: fd, i: rev, h: flm, g: fdm },
    dat,
    { sz },
    consume,
    cb
  );

// async deflate
const cbDflt = (dat: Uint8Array, opt: AsyncDeflateOptions = {}, pre: number, post: number, cb: FlateCallback) =>
  wrkr(
    'r=Uint8Array,f=Uint16Array,n=Uint32Array,w=function(n,e){for(var a=n.length,t=0,o=new r(e);t<a;++t)++o[n[t]-1];var i=new f(e);for(t=0;t<e;++t)i[t]=i[t-1]+o[t-1]<<1;var v=new f(a);for(t=0;t<a;++t)v[t]=u[i[n[t]-1]++]>>>15-n[t];return v},M=function(r,f,n){n<<=7&f;var e=f>>>3;r[e]|=n,r[e+1]|=n>>>8},b=function(r,f,n){n<<=7&f;var e=f>>>3;r[e]|=n,r[e+1]|=n>>>8,r[e+2]|=n>>>16},m=function(n,e){for(var a=[],t=0;t<n.length;++t)n[t]&&a.push({s:t,f:n[t]});var o=a.length,i=a.slice();if(0==o)return[new r(0),0];if(1==o){var v=new r(a[0].s+1);return v[a[0].s]=1,[v,1]}a.sort((function(r,f){return r.f-f.f})),a.push({s:-1,f:25001});var s=a[0],u=a[1],l=0,c=1,h=2;for(a[0]={s:-1,f:s.f+u.f,l:s,r:u};c!=o-1;)s=a[a[l].f<a[h].f?l++:h++],u=a[l!=c&&a[l].f<a[h].f?l++:h++],a[c++]={s:-1,f:s.f+u.f,l:s,r:u};var w=i[0].s;for(t=1;t<o;++t)i[t].s>w&&(w=i[t].s);var M=new f(w+1),g=p(a[c-1],M,0);if(g>e){t=0;var b=0,m=g-e,d=1<<m;for(i.sort((function(r,f){return M[f.s]-M[r.s]||r.f-f.f}));t<o;++t){var y=i[t].s;if(!(M[y]>e))break;b+=d-(1<<g-M[y]),M[y]=e}for(b>>>=m;b>0;){var U=i[t].s;M[U]<e?b-=1<<e-M[U]++-1:++t}for(;t>=0&&b;--t){var k=i[t].s;M[k]==e&&(--M[k],++b)}g=e}return[new r(M),g]},p=function(r,f,n){return-1==r.s?Math.max(p(r.l,f,n+1),p(r.r,f,n+1)):f[r.s]=n},A=function(r){for(var n=r.length;n&&!r[--n];);for(var e=new f(++n),a=0,t=r[0],o=1,i=function(r){e[a++]=r},v=1;v<=n;++v)if(r[v]==t&&v!=n)++o;else{if(!t&&o>2){for(;o>138;o-=138)i(32754);o>2&&(i(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(i(t),--o;o>6;o-=6)i(8304);o>2&&(i(o-3<<5|8208),o=0)}for(;o--;)i(t);o=1,t=r[v]}return[e.slice(0,a),n]},U=function(r,f){for(var n=0,e=0;e<f.length;++e)n+=r[e]*f[e];return n},d=function(r,f,n){var e=n.length,a=f+2>>>3;r[a+1]=255&e,r[a+2]=e>>>8,r[a+3]=255^r[a+1],r[a+4]=255^r[a+2];for(var t=0;t<e;++t)r[a+t+5]=n[t];return a+4+e<<3},k=function(r,n,t,i,v,s,u,l,p,k,x){M(n,x++,t),++v[256];for(var j=m(v,15),O=j[0],q=j[1],z=m(s,15),B=z[0],C=z[1],D=A(O),E=D[0],F=D[1],G=A(B),H=G[0],I=G[1],J=new f(19),K=0;K<E.length;++K)J[31&E[K]]++;for(K=0;K<H.length;++K)J[31&H[K]]++;for(var L=m(J,7),N=L[0],P=L[1],Q=19;Q>4&&!N[o[Q-1]];--Q);var R,S,T,V,W=k+5<<3,X=U(v,c)+U(s,h)+u,Y=U(v,O)+U(s,B)+u+14+3*Q+U(J,N)+(2*J[16]+3*J[17]+7*J[18]);if(W<X&&W<Y)return d(n,x,r.subarray(p,p+k));if(M(n,x,1+(Y<X)),x+=2,Y<X){R=w(O,q),S=O,T=w(B,C),V=B;var Z=w(N,P);for(M(n,x,F-257),M(n,x+5,I-1),M(n,x+10,Q-4),x+=14,K=0;K<Q;++K)M(n,x+3*K,N[o[K]]);x+=3*Q;for(var $=[E,H],_=0;_<2;++_){var rr=$[_];for(K=0;K<rr.length;++K){var fr=31&rr[K];M(n,x,Z[fr]),x+=N[fr],fr>15&&(M(n,x,rr[K]>>>5&127),x+=rr[K]>>>12)}}}else R=g,S=c,T=y,V=h;for(K=0;K<l;++K)if(i[K]>255){fr=i[K]>>>18&31,b(n,x,R[fr+257]),x+=S[fr+257],fr>7&&(M(n,x,i[K]>>>23&31),x+=e[fr]);var nr=31&i[K];b(n,x,T[nr]),x+=V[nr],nr>3&&(b(n,x,i[K]>>>5&8191),x+=a[nr])}else b(n,x,R[i[K]]),x+=S[i[K]];return b(n,x,R[256]),x+S[256]},rn=function(t,o,s,u,l){var c=t.length,h=new r(u+c+5*Math.ceil(c/7e3)+l),w=h.subarray(u,h.length-l),M=0;if(o)if(c<8)M=d(w,0,t);else{for(var g=x[o-1],b=g>>>13,m=8191&g,p=(1<<s)-1,y=new f(32768),U=new f(p+1),A=Math.ceil(s/3),j=2*A,O=function(r){return(t[r]^t[r+1]<<A^t[r+2]<<j)&p},q=new n(25e3),z=new f(288),B=new f(32),C=0,D=0,E=(fr=0,0),F=0,G=0;fr<c;++fr){var H=O(fr),I=32767&fr,J=U[H];if(y[I]=J,U[H]=I,F<=fr){var K=c-fr;if((C>7e3||E>24576)&&K>423){M=k(t,w,0,q,z,B,D,E,G,fr-G,M),E=C=D=0,G=fr;for(var L=0;L<286;++L)z[L]=0;for(L=0;L<30;++L)B[L]=0}var N=2,P=0,Q=m,R=I-J&32767;if(K>2&&H==O(fr-R))for(var S=Math.min(b,K),T=Math.min(32767,fr),V=Math.min(258,K);R<=T&&--Q&&I!=J;){if(t[fr+N]==t[fr+N-R]){for(var W=0;W<V&&t[fr+W]==t[fr+W-R];++W);if(W>N){if(N=W,P=R,W>=S)break;var X=Math.min(R,W-2),Y=0;for(L=0;L<X;++L){var Z=fr-R+L+32768&32767,$=Z-y[Z]+32768&32767;$>Y&&(Y=$,J=Z)}}}R+=(I=J)-(J=y[I])+32768&32767}if(P){q[E++]=268435456|v[N]<<18|i[P];var _=31&v[N],rr=31&i[P];D+=e[_]+a[rr],++z[257+_],++B[rr],F=fr+N,++C}else q[E++]=t[fr],++z[t[fr]]}}M=k(t,w,1,q,z,B,D,E,G,fr-G,M)}else for(var fr=0;fr<c;fr+=65535){var nr=fr+65535;nr<c?M=d(w,M,t.subarray(fr,nr)):(w[fr]=1,M=d(w,M,t.subarray(fr,c)))}return h.slice(0,u+(M>>>3)+1+l)},onmessage=function(r){for(var n in r.data)self[n]=r.data[n];var e=rn(dt,lv,pv,pr,po);postMessage(e,[e.buffer])}',
    { e: fleb, a: fdeb, o: clim, v: revfl, i: revfd, c: flt, h: fdt, g: flnm, y: fdnm, x: deo, u: rev },
    dat,
    { lv: opt.level == null ? 6 : opt.level, pv: gmem(dat.length, opt.mem), pr: pre, po: post },
    opt.consume,
    cb
  );

// read 2 bytes
const b2 = (d: Uint8Array, b: number) => d[b] | (d[b + 1] << 8);

// read 4 bytes
const b4 = (d: Uint8Array, b: number) => d[b] | (d[b + 1] << 8) | (d[b + 2] << 16) | (d[b + 3] << 24);

// write bytes
const wbytes = (d: Uint8Array, b: number, v: number) => {
  for (; v; ++b) d[b] = v, v >>>= 8;
}

// gzip unwrap
const gzuwrp = (d: Uint8Array, o?: number) => {
  const l = d.length;
  if (l < 18 || d[0] != 31 || d[1] != 139 || d[2] != 8) throw 'invalid gzip data';
  const flg = d[3];
  let st = 10 + (flg & 2);
  if (flg & 4) st += d[10] | (d[11] << 8) + 2;
  for (let zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= (d[st++] == 0) as unknown as number);
  return [d.subarray(st, -8), o || (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24)] as const;
}

// gzip wrap
const gzwrp = (c: Uint8Array, l: number, crc: number, o: GzipOptions = {}) => {
  const fn = o.filename;
  const s = c.length;
  c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level == 0 ? 4 : o.level == 9 ? 2 : 3, c[9] = 3; // assume Unix
  if (o.mtime != 0) wbytes(c, 4, Math.floor((new Date(o.mtime as (string | number) || Date.now()) as unknown as number) / 1000));
  if (fn) for (let i = 0; i <= fn.length; ++i) c[i + 10] = fn.charCodeAt(i);
  wbytes(c, s - 8, crc), wbytes(c, s - 4, l);
  return c;
}

// calc gzip pre
const gzpre = (o: GzipOptions) => 10 + ((o && o.filename && o.filename.length) || 0);

// zlib unwrap
const zluwrp = (d: Uint8Array) => {
  const l = d.length;
  if (l < 6 || (d[0] & 15) != 8 || (d[0] >>> 4) > 7) throw 'invalid zlib data';
  if (d[1] & 32) throw 'invalid zlib data: dictionaries not supported';
  return d.subarray(2, -4);
}

const zlwrp = (c: Uint8Array, adl: number, o: ZlibOptions = {}) => {
  const s = c.length;
  const lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
  c[0] = 120, c[1] = (fl << 6) | (fl ? (32 - 2 * fl) : 1);
  wbytes(c, s - 4, adl)
  return c;
}

/**
 * Asynchronously compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @param cb The function to be called upon compression completion
 * @returns A function that can be used to immediately terminate the compression
 */
export function deflate(data: Uint8Array, opts: AsyncDeflateOptions, cb: FlateCallback): AsyncTerminable;
/**
 * Asynchronously compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param cb The function to be called upon compression completion
 */
export function deflate(data: Uint8Array, cb: FlateCallback): AsyncTerminable;
export function deflate(data: Uint8Array, opts: AsyncDeflateOptions | FlateCallback, cb?: FlateCallback) {
  if (!cb) cb = opts as FlateCallback, opts = {};
  return cbDflt(data, opts as AsyncDeflateOptions, 0, 0, cb);
}

/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
export function deflateSync(data: Uint8Array, opts?: DeflateOptions) {
  return dopt(data, opts, 0, 0);
}

/**
 * Asynchronously expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param opts The decompression options
 * @param cb The function to be called upon decompression completion
 * @returns A function that can be used to immediately terminate the decompression
 */
export function inflate(data: Uint8Array, opts: AsyncInflateOptions, cb: FlateCallback): AsyncTerminable;
/**
 * Asynchronously expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param cb The function to be called upon decompression completion
 * @returns A function that can be used to immediately terminate the decompression
 */
export function inflate(data: Uint8Array, cb: FlateCallback): AsyncTerminable;
export function inflate(data: Uint8Array, opts: AsyncInflateOptions | FlateCallback, cb?: FlateCallback) {
  if (!cb) cb = opts as FlateCallback, opts = {};
  return cbInflt(data, (opts as AsyncInflateOptions).size, (opts as AsyncInflateOptions).consume, cb);
}

/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export function inflateSync(data: Uint8Array, out?: Uint8Array) {
  return inflt(data, out);
}

/**
 * Asynchronously compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @param cb The function to be called upon compression completion
 * @returns A function that can be used to immediately terminate the compression
 */
export function gzip(data: Uint8Array, opts: AsyncGzipOptions, cb: FlateCallback): AsyncTerminable;
/**
 * Asynchronously compresses data with GZIP
 * @param data The data to compress
 * @param cb The function to be called upon compression completion
 * @returns A function that can be used to immediately terminate the decompression
 */
export function gzip(data: Uint8Array, cb: FlateCallback): AsyncTerminable;
export function gzip(data: Uint8Array, opts: AsyncGzipOptions | FlateCallback, cb?: FlateCallback) {
  if (!cb) cb = opts as FlateCallback, opts = {};
  const c = crc(data), l = data.length;
  return cbDflt(data, opts as AsyncGzipOptions, gzpre(opts as AsyncGzipOptions), 8, (err, res) => {
    cb(err, err ? res : gzwrp(res, l, c, opts as AsyncGzipOptions));
  });
}

/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
export function gzipSync(data: Uint8Array, opts?: GzipOptions) {
  return gzwrp(dopt(data, opts, gzpre(opts), 8), data.length, crc(data));
}


/**
 * Asynchronously expands GZIP data
 * @param data The data to decompress
 * @param opts The decompression options
 * @param cb The function to be called upon decompression completion
 * @returns A function that can be used to immediately terminate the decompression
 */
export function gunzip(data: Uint8Array, opts: AsyncGunzipOptions, cb: FlateCallback): AsyncTerminable;
/**
 * Asynchronously expands GZIP data
 * @param data The data to decompress
 * @param cb The function to be called upon decompression completion
 * @returns A function that can be used to immediately terminate the decompression
 */
export function gunzip(data: Uint8Array, cb: FlateCallback): AsyncTerminable;
export function gunzip(data: Uint8Array, opts: AsyncGunzipOptions | FlateCallback, cb?: FlateCallback) {
  if (!cb) cb = opts as FlateCallback, opts = {};
  const [uwrp, sz] = gzuwrp(data);
  return cbInflt(uwrp, (opts as AsyncInflateOptions).size || sz, (opts as AsyncInflateOptions).consume, cb);
}

/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */
export function gunzipSync(data: Uint8Array, out?: Uint8Array) {
  const [uwrp, sz] = gzuwrp(data);
  return inflt(uwrp, out || new u8(sz));
}

/**
 * Asynchronously compresses data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @param cb The function to be called upon compression completion
 */
export function zlib(data: Uint8Array, opts: AsyncZlibOptions, cb: FlateCallback): AsyncTerminable;
/**
 * Asynchronously compresses data with Zlib
 * @param data The data to compress
 * @param cb The function to be called upon compression completion
 * @returns A function that can be used to immediately terminate the compression
 */
export function zlib(data: Uint8Array, cb: FlateCallback): AsyncTerminable;
export function zlib(data: Uint8Array, opts: AsyncZlibOptions | FlateCallback, cb?: FlateCallback) {
  if (!cb) cb = opts as FlateCallback, opts = {};
  const a = adler(data);
  return cbDflt(data, opts as AsyncZlibOptions, 2, 4, (err, res) => {
    cb(err, err ? res : zlwrp(res, a, opts as AsyncZlibOptions));
  });
}

/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
export function zlibSync(data: Uint8Array, opts?: ZlibOptions) {
  return zlwrp(dopt(data, opts, 2, 4), adler(data), opts);
}

/**
 * Asynchronously expands Zlib data
 * @param data The data to decompress
 * @param opts The decompression options
 * @param cb The function to be called upon decompression completion
 * @returns A function that can be used to immediately terminate the decompression
 */
export function unzlib(data: Uint8Array, opts: AsyncGunzipOptions, cb: FlateCallback): AsyncTerminable;
/**
 * Asynchronously expands Zlib data
 * @param data The data to decompress
 * @param cb The function to be called upon decompression completion
 * @returns A function that can be used to immediately terminate the decompression
 */
export function unzlib(data: Uint8Array, cb: FlateCallback): AsyncTerminable;
export function unzlib(data: Uint8Array, opts: AsyncGunzipOptions | FlateCallback, cb?: FlateCallback) {
  if (!cb) cb = opts as FlateCallback, opts = {};
  return cbInflt(zluwrp(data), (opts as AsyncInflateOptions).size, (opts as AsyncInflateOptions).consume, cb);
}

/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export function unzlibSync(data: Uint8Array, out?: Uint8Array) {
  return inflt(zluwrp(data), out);
}

// Default algorithm for compression (used because having a known output size allows faster decompression)
export { gzip as compress };
// Default algorithm for compression (used because having a known output size allows faster decompression)
export { gzipSync as compressSync }

/**
 * Asynchrononously expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param opts The decompression options
 * @param cb The function to be called upon decompression completion
 * @returns A function that can be used to immediately terminate the decompression
 */
export function decompress(data: Uint8Array, opts: AsyncInflateOptions, cb: FlateCallback): AsyncTerminable;
/**
 * Asynchrononously expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param cb The function to be called upon decompression completion
 * @returns A function that can be used to immediately terminate the decompression
 */
export function decompress(data: Uint8Array, cb: FlateCallback): AsyncTerminable;
export function decompress(data: Uint8Array, opts: AsyncInflateOptions | FlateCallback, cb?: FlateCallback) {
  if (!cb) cb = opts as FlateCallback, opts = {};
  return (data[0] == 31 && data[1] == 139 && data[2] == 8)
    ? gunzip(data, opts as AsyncInflateOptions, cb)
    : ((data[0] & 15) != 8 || (data[0] >> 4) > 7)
      ? inflate(data, opts as AsyncInflateOptions, cb)
      : unzlib(data, opts as AsyncInflateOptions, cb);
}

/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export function decompressSync(data: Uint8Array, out?: Uint8Array) {
  if (data[0] == 31 && data[1] == 139 && data[2] == 8) return gunzipSync(data, out);
  if ((data[0] & 15) != 8 || (data[0] >> 4) > 7) return inflateSync(data, out);
  return unzlibSync(data, out);
}

/**
 * Options for creating a ZIP archive
 */
export interface ZipOptions extends DeflateOptions, Pick<GzipOptions, 'mtime'> {}

/**
 * Options for asynchronously creating a ZIP archive
 */
export interface AsyncZipOptions extends AsyncDeflateOptions, Pick<AsyncGzipOptions, 'mtime'> {}

/**
 * A file that can be used to create a ZIP archive
 */
export type ZippableFile = Uint8Array | [Uint8Array, ZipOptions];

/**
 * A file that can be used to asynchronously createa a ZIP archive
 */
export type AsyncZippableFile = Uint8Array | [Uint8Array, AsyncZipOptions];

/**
 * The complete directory structure of a ZIPpable archive
 */
export interface Zippable extends Record<string, Zippable | ZippableFile> {}

/**
 * The complete directory structure of an asynchronously ZIPpable archive
 */
export interface AsyncZippable extends Record<string, AsyncZippable | AsyncZippableFile> {}

/**
 * An unzipped archive. The full path of each file is used as the key,
 * and the file is the value
 */
export interface Unzipped extends Record<string, Uint8Array> {}

/**
 * Callback for asynchronous ZIP decompression
 * @param err Any error that occurred
 * @param data The decompressed ZIP archive
 */
export type UnzipCallback = (err: Error, data: Unzipped) => unknown;

// flattened Zippable
type FlatZippable<A extends boolean> = Record<string, [Uint8Array, (A extends true ? AsyncZipOptions : ZipOptions)]>;

// flatten a directory structure
const fltn = <A extends boolean>(d: A extends true ? AsyncZippable : Zippable, p: string, t: FlatZippable<A>, o: ZipOptions) => {
  for (const k in d) {
    const val = d[k], n = p + k;
    if (val instanceof u8) t[n] = [val, o] as unknown as FlatZippable<A>[string];
    else if (Array.isArray(val)) t[n] = [val[0], mrg(o, val[1])] as FlatZippable<A>[string];
    else fltn(val as unknown as (A extends true ? AsyncZippable : Zippable), n + '/', t, o);
  }
}

// write UTF-8 string to Uint8Array
const stu8 = (s: string) => {
  const l = s.length;
  const ar = new u8(65535);
  let ai = 0;
  const w = (v: number) => { ar[ai++] = v; };
  for (let i = 0; i < l && ai < 65536; ++i) {
    let c = s.charCodeAt(i);
    if (c < 128) ar[ai++] = c;
    else if (c < 2048) w(192 | (c >>> 6)), w(128 | (c & 63));
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | (s.charCodeAt(++i) & 1023),
      w(240 | (c >>> 18)), w(128 | ((c >>> 12) & 63)), w(128 | ((c >>> 6) & 63)), w(128 | (c & 63));
    else w(224 | (c >>> 12)), w(128 | ((c >>> 6) & 63)), w(128 | (c & 63));
  }
  return ai > 65535 ? null : ar.slice(0, ai);
};

// Uint8Array to string
const u8ts = (ar: Uint8Array, lt1: boolean) => {
  let r = '';
  for (let i = 0; i < ar.length;) {
    let c = ar[i++];
    if (c < 128 || lt1) r += String.fromCharCode(c);
    else if (c < 224) r += String.fromCharCode((c & 31) << 6 | (ar[i++] & 63));
    else if (c < 240) r += String.fromCharCode((c & 15) << 12 | (ar[i++] & 63) << 6 | (ar[i++] & 63));
    else
      c = ((c & 15) << 18 | (ar[i++] & 63) << 12 | (ar[i++] & 63) << 6 | (ar[i++] & 63)) - 65536,
      r += String.fromCharCode(55296 + (c >> 10), 56320 + (c & 1023));
  }
  return r;
};

// read zip header
const zh = (d: Uint8Array, b: number) => {
  const u = b2(d, b + 6) & 2048, c = b2(d, b + 8), sc = b4(d, b += 18), su = b4(d, b + 4), fnl = b2(d, b + 8), fn = u8ts(d.subarray(b += 12, b += fnl), !u);
  return [sc, c, su, fn, b] as const;
}

// write zip header
const wzh = (d: Uint8Array, b: number, c: number, cmp: Uint8Array, su: number, fn: Uint8Array, u: boolean, o: ZipOptions, ce: number | null, t: number) => {
  const fl = fn.length, l = cmp.length;
  wbytes(d, b, ce != null ? 0x2014B50 : 0x4034B50), b += 4;
  if (ce != null) d[b] = 20, b += 2;
  d[b] = 20, b += 2; // spec compliance? what's that?
  d[b++] = (t == 8 && (o.level == 1 ? 6 : o.level < 6 ? 4 : o.level == 9 ? 2 : 0)), d[b++] = u && 8;
  d[b] = t, b += 2;
  const dt = new Date(o.mtime || Date.now()), y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119) throw 'date not in range 1980-2099';
  wbytes(d, b, (y << 25) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >>> 1));
  b += 4;
  wbytes(d, b, c);
  wbytes(d, b + 4, l);
  wbytes(d, b + 8, su);
  wbytes(d, b + 12, fl), b += 16; // skip extra field, comment
  if (ce != null) wbytes(d, b += 10, ce), b += 4;
  for (let i = 0; i < fl; ++i) d[b + i] = fn[i];
  b += fl;
  if (ce == null) {
    for (let i = 0; i < l; ++i) d[b + i] = cmp[i];
    b += l;
  }
}

// write zip footer (end of central directory)
const wzf = (o: Uint8Array, b: number, c: number, d: number, e: number) => {
  wbytes(o, b, 0x6054B50); // skip disk
  wbytes(o, b + 8, c);
  wbytes(o, b + 10, c);
  wbytes(o, b + 12, d);
  wbytes(o, b + 16, e);
}

// internal zip data
type AsyncZipDat = {
  // compressed data
  d: Uint8Array;
  // uncompressed length
  m: number;
  // type (0 = uncompressed, 8 = DEFLATE)
  t: number;
  // filename as Uint8Array
  n: Uint8Array;
  // Unicode filename
  u: boolean;
  // CRC32
  c: number;
  // zip options
  p: ZipOptions;
};

type ZipDat = AsyncZipDat & {
  // total offset
  o: number;
}


/**
 * Asynchronously creates a ZIP file
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @param cb The callback to call with the generated ZIP archive
 * @returns A function that can be used to immediately terminate the compression
 */
export function zip(data: AsyncZippable, opts: AsyncZipOptions, cb: FlateCallback): AsyncTerminable;
/**
 * Asynchronously creates a ZIP file
 * @param data The directory structure for the ZIP archive
 * @param cb The callback to call with the generated ZIP archive
 * @returns A function that can be used to immediately terminate the compression
 */
export function zip(data: AsyncZippable, cb: FlateCallback): AsyncTerminable;
export function zip(data: AsyncZippable, opts: AsyncZipOptions | FlateCallback, cb?: FlateCallback) {
  if (!cb) cb = opts as FlateCallback, opts = {};
  const r: FlatZippable<true> = {};
  fltn(data, '', r, opts as AsyncZipOptions);
  const k = Object.keys(r);
  let lft = k.length, o = 0, tot = 0;
  const slft = lft, files = new Array<AsyncZipDat>(lft);
  const term: AsyncTerminable[] = [];
  const tAll = () => {
    for (let i = 0; i < term.length; ++i) term[i]();
  }
  const cbf = () => {
    const out = new u8(tot + 22), oe = o, cdl = tot - o;
    tot = 0;
    for (let i = 0; i < slft; ++i) {
      const f = files[i];
      wzh(out, tot, f.c, f.d, f.m, f.n, f.u, f.p, null, f.t);
      wzh(out, o, f.c, f.d, f.m, f.n, f.u, f.p, tot, f.t), o += 46 + f.n.length, tot += 30 + f.n.length + f.d.length;
    }
    wzf(out, o, files.length, cdl, oe);
    cb(null, out);
  }
  // Cannot use lft because it can decrease
  for (let i = 0; i < slft; ++i) {
    const fn = k[i];
    const [file, p] = r[fn];
    const c = crc(file);
    const n = stu8(fn), s = n.length;
    const t = p.level == 0 ? 0 : 8;
    if (!n) throw 'filename too long';
    const cbl: FlateCallback = (e, d) => {
      if (e) {
        tAll();
        cb(e, null);
      } else {
        const l = d.length;
        files[i] = {
          t,
          d,
          m: file.length,
          c,
          u: fn.length != l,
          n,
          p
        };
        o += 30 + s + l;
        tot += 76 + 2 * s + l;
        if (!--lft) cbf();
      }
    }
    if (t) term.push(deflate(file, opts as AsyncZipOptions, cbl));
    else cbl(null, file);
  }
  return tAll;
}

/**
 * Synchronously creates a ZIP file. Prefer using `zip` for better performance
 * with more than one file.
 * @param data The directory structure for the ZIP archive
 * @param opts The main options, merged with per-file options
 * @returns The generated ZIP archive
 */
export function zipSync(data: Zippable, opts: ZipOptions = {}) {
  const r: FlatZippable<false> = {};
  const files: ZipDat[] = [];
  fltn(data, '', r, opts);
  let o = 0;
  let tot = 0;
  for (const fn in r) {
    const [file, p] = r[fn];
    const t = p.level == 0 ? 0 : 8;
    const n = stu8(fn), s = n.length;
    if (!n) throw 'filename too long';
    const d = t ? deflateSync(file, p) : file, l = d.length;
    const c = crc(file);
    files.push({
      t,
      d,
      m: file.length,
      c,
      u: fn.length != s,
      n,
      o,
      p
    });
    o += 30 + s + l;
    tot += 76 + 2 * s + l;
  }
  const out = new u8(tot + 22), oe = o, cdl = tot - o;
  for (let i = 0; i < files.length; ++i) {
    const f = files[i];
    wzh(out, f.o, f.c, f.d, f.m, f.n, f.u, f.p, null, f.t);
    wzh(out, o, f.c, f.d, f.m, f.n, f.u, f.p, f.o, f.t), o += 46 + f.n.length;
  }
  wzf(out, o, files.length, cdl, oe);
  return out;
}

/**
 * Asynchronously decompresses a ZIP archive
 * @param data The raw compressed ZIP file
 * @param cb The callback to call with the decompressed files
 * @returns A function that can be used to immediately terminate the unzipping
 */
export function unzip(data: Uint8Array, cb: UnzipCallback): AsyncTerminable {
  const term: AsyncTerminable[] = [];
  const tAll = () => {
    for (let i = 0; i < term.length; ++i) term[i]();
  }
  const files: Unzipped = {};
  let e = data.length - 22;
  while (b4(data, e) != 0x6054B50) --e;
  let lft = b2(data, e + 8);
  const c = lft;
  let o = b4(data, e + 16);
  for (let i = 0; i < c; ++i) {
    const off = b4(data, o + 42);
    o += 46 + b2(data, o + 28) + b2(data, o + 30) + b2(data, o + 32);
    const [sc, c, su, fn, b] = zh(data, off);
    const cbl: FlateCallback = (e, d) => {
      if (e) {
        tAll();
        cb(e, null);
      } else {
        files[fn] = d;
        if (!--lft) cb(null, files);
      }
    }
    if (!c) cbl(null, data.slice(b, b + sc))
    else if (c == 8) inflate(data.subarray(b, b + sc), { size: su }, cbl);
    else throw 'unknown compression type ' + c;
  }
  return tAll;
}

/**
 * Synchronously decompresses a ZIP archive
 * @param data The raw compressed ZIP file
 * @returns The decompressed files
 */
export function unzipSync(data: Uint8Array) {
  const files: Unzipped = {};
  let e = data.length - 22;
  while (b4(data, e) != 0x6054B50) --e;
  const c = b2(data, e + 8);
  let o = b4(data, e + 16);
  for (let i = 0; i < c; ++i) {
    const off = b4(data, o + 42);
    o += 46 + b2(data, o + 28) + b2(data, o + 30) + b2(data, o + 32);
    const [sc, c, su, fn, b] = zh(data, off);
    if (!c) files[fn] = data.slice(b, b + sc);
    else if (c == 8) files[fn] = inflateSync(data.subarray(b, b + sc), new u8(su));
    else throw 'unknown compression type ' + c;
  }
  return files;
}