// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951

// Much of the following code is similar to that of UZIP.js:
// https://github.com/photopea/UZIP.js
// Many optimizations have been made, so the bundle size is ultimately smaller but performance is similar.

// Sometimes 0 will appear where -1 would be more appropriate. This is because using a uint
// is better for memory in most engines (I *think*).

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
const flt = new u8(286);
for (let i = 0; i < 144; ++i) flt[i] = 8;
for (let i = 144; i < 256; ++i) flt[i] = 9;
for (let i = 256; i < 280; ++i) flt[i] = 7;
for (let i = 280; i < 286; ++i) flt[i] = 8;
// fixed distance tree
const fdt = new u8(30);
for (let i = 0; i < 30; ++i) fdt[i] = 5;
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
  return buf.slice(0, bt);
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
  out.set(dat, o + 5);
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
  if (!lvl || dat.length < 4) {
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
    const lf = new u16(286), df = new u16(30);
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
    if (bs != i) pos = wblk(dat, w, 1, syms, lf, df, eb, li, bs, i - bs, pos);
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
   * 
   * The default value is automatically determined based on the size of the input data.
   */
  mem?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

/**
 * Options for compressing data into a GZIP format
 */
export interface GZIPOptions extends DeflateOptions {
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

// deflate with opts
const dopt = (dat: Uint8Array, opt: DeflateOptions, pre: number, post: number) =>
  dflt(dat, opt.level || 6, 12 + (opt.mem || 4), pre, post);

// write bytes
const wbytes = (d: Uint8Array, b: number, v: number) => {
  for (let i = b; v; ++i) d[i] = v, v >>>= 8;
}

/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
export function deflate(data: Uint8Array, opts: DeflateOptions = {}) {
  return dopt(data, opts, 0, 0);
}

/**
 * Expands DEFLATE data with no wrapper
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export function inflate(data: Uint8Array, out?: Uint8Array) {
  return inflt(data, out);
}

/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
export function gzip(data: Uint8Array, opts: GZIPOptions = {}) {
  const fn = opts.filename;
  const l = data.length, raw = dopt(data, opts, 10 + ((fn && fn.length + 1) || 0), 8), s = raw.length;
  raw[0] = 31, raw[1] = 139, raw[2] = 8, raw[8] = opts.level == 0 ? 4 : opts.level == 9 ? 2 : 3, raw[9] = 255;
  let mt = Math.floor((new Date(opts.mtime as (string | number) || Date.now()) as unknown as number) / 1000);
  wbytes(raw, 4, mt);
  if (fn) for (let i = 0; i <= fn.length; ++i) raw[i + 10] = fn.charCodeAt(i);
  // CRC32
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < l; ++i) crc = crct[(crc & 255) ^ data[i]] ^ (crc >>> 8);
  wbytes(raw, s - 8, crc ^ 0xFFFFFFFF), wbytes(raw, s - 4, l);
  return raw;
}

/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */
export function gunzip(data: Uint8Array, out?: Uint8Array) {
  const l = data.length;
  if (l < 18 || data[0] != 31 || data[1] != 139 || data[2] != 8) throw new Error('invalid gzip data');
  const flg = data[3];
  let st = 10 + (flg & 2);
  if (flg & 4) st += data[10] | (data[11] << 8) + 2;
  for (let zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= (data[st++] == 0) as unknown as number);
  if (!out) out = new Uint8Array(data[l - 4] | data[l - 3] << 8 | data[l - 2] << 16 | data[l - 1] << 24);
  return inflt(data.subarray(st, -8), out);
}

/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
export function zlib(data: Uint8Array, opts: ZlibOptions) {
  const l = data.length, raw = dopt(data, opts, 2, 4), s = raw.length;
  const lv = opts.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
  raw[0] = 120, raw[1] = (fl << 6) | (fl ? (32 - 2 * fl) : 1);
  // Adler32
  let a = 1, b = 0;
  for (let i = 0; i != l;) {
    const e = Math.min(i + 5552, l);
    for (; i < e; ++i) a += data[i], b += a;
    a %= 65521, b %= 65521;
  }
  raw[s - 4] = b >>> 8, raw[s - 3] = b & 255, raw[s - 2] = a >>> 8, raw[s - 1] = a & 255;
  return raw;
}

/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export function unzlib(data: Uint8Array, out?: Uint8Array) {
  const l = data.length;
  if (l < 6 || (data[0] & 15) != 8 || (data[0] >>> 4) > 7) throw new Error('invalid zlib data');
  if (data[1] & 32) throw new Error('invalid zlib data: dictionaries not supported');
  return inflt(data.subarray(2, -4), out);
}

// Default algorithm for compression (used because having a known output size allows faster decompression)
export { gzip as compress };

/**
 * Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export function decompress(data: Uint8Array, out?: Uint8Array) {
  if (data[0] == 31 && data[1] == 139 && data[2] == 8) return gunzip(data, out);
  if ((data[0] & 15) != 8 || (data[0] >> 4) > 7) return inflate(data, out);
  return unzlib(data, out);
}