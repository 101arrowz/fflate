// DEFLATE is a complex format; to read this code, you should probably check the RFC first:
// https://tools.ietf.org/html/rfc1951
// You may also wish to take a look at the guide I made about this program:
// https://gist.github.com/101arrowz/253f31eb5abc3d9275ab943003ffecad

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
  // reverse table algorithm from SO
  let x = ((i & 0xAAAA) >>> 1) | ((i & 0x5555) << 1);
  x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
  x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
  rev[i] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
}

// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
const hMap = ((cd: Uint8Array, mb: number, r: 0 | 1) => {
  const s = cd.length;
  // index
  let i = 0;
  // u16 "map": index -> # of codes with bit length = index
  const l = new u16(mb);
  // length of cd must be 288 (total # of codes)
  for (; i < s; ++i) ++l[cd[i] - 1];
  // u16 "map": index -> minimum code for bit length = index
  const le = new u16(mb);
  for (i = 0; i < mb; ++i) {
    le[i] = (le[i - 1] + l[i - 1]) << 1;
  }
  let co: Uint16Array;
  if (r) {
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
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
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
const flm = /*#__PURE__*/ hMap(flt, 9, 0), flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
const fdm = /*#__PURE__*/ hMap(fdt, 5, 0), fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);

// find max of array
const max = (a: Uint8Array | number[]) => {
  let m = a[0];
  for (let i = 1; i < a.length; ++i) {
    if (a[i] > m) m = a[i];
  }
  return m;
};

// read d, starting at bit p and mask with m
const bits = (d: Uint8Array, p: number, m: number) => {
  const o = (p / 8) >> 0;
  return ((d[o] | (d[o + 1] << 8)) >>> (p & 7)) & m;
}

// read d, starting at bit p continuing for at least 16 bits
const bits16 = (d: Uint8Array, p: number) => {
  const o = (p / 8) >> 0;
  return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >>> (p & 7));
}

// get end of byte
const shft = (p: number) => ((p / 8) >> 0) + (p & 7 && 1);

// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
const slc = <T extends Uint8Array | Uint16Array | Uint32Array>(v: T, s: number, e?: number): T => {
  if (s == null || s < 0) s = 0;
  if (e == null || e > v.length) e = v.length;
  // can't use .constructor in case user-supplied
  const n = new (v instanceof u16 ? u16 : v instanceof u32 ? u32 : u8)(e - s) as T;
  n.set(v.subarray(s, e));
  return n;
}

// inflate state
type InflateState = {
  // lmap
  l?: Uint16Array;
  // dmap
  d?: Uint16Array;
  // lbits
  m?: number;
  // dbits
  n?: number;
  // final
  f?: number;
  // pos
  p?: number;
  // byte
  b?: number;
  // lstchk
  i?: boolean;
};

// expands raw DEFLATE data
const inflt = (dat: Uint8Array, buf?: Uint8Array, st?: InflateState) => {
  // source length
  const sl = dat.length;
  // have to estimate size
  const noBuf = !buf || (st as unknown as boolean);
  // no state
  const noSt = !st || st.i;
  if (!st) st = {};
  // Assumes roughly 33% compression ratio average
  if (!buf) buf = new u8(sl * 3);
  // ensure buffer can fit at least l elements
  const cbuf = (l: number) => {
    let bl = buf.length;
    // need to increase size to fit
    if (l > bl) {
      // Double or set to necessary, whichever is greater
      const nbuf = new u8(Math.max(bl * 2, l));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  //  last chunk         bitpos           bytes
  let final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  // total bits
  const tbts = sl * 8;
  do {
    if (!lm) {
      // BFINAL - this is only 1 when last chunk is next
      st.f = final = bits(dat, pos, 1);
      // type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
      const type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        // go to end of byte boundary
        const s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
        if (t > sl) {
          if (noSt) throw 'unexpected EOF';
          break;
        }
        // ensure size
        if (noBuf) cbuf(bt + l);
        // Copy over uncompressed data
        buf.set(dat.subarray(s, t), bt);
        // Get new bitpos, update byte count
        st.b = bt += l, st.p = pos = t * 8;
        continue;
      }
      else if (type == 1) lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        //  literal                            lengths
        const hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        const tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        // length+distance tree
        const ldt = new u8(tl);
        // code length tree
        const clt = new u8(19);
        for (let i = 0; i < hcLen; ++i) {
          // use index map to get real code
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        // code lengths bits
        const clb = max(clt), clbmsk = (1 << clb) - 1;
        if (!noSt && pos + tl * (clb + 7) > tbts) break;
        // code lengths map
        const clm = hMap(clt, clb, 1);
        for (let i = 0; i < tl;) {
          const r = clm[bits(dat, pos, clbmsk)];
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
            if (s == 16) n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17) n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18) n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--) ldt[i++] = c;
          }
        }
        //    length tree                 distance tree
        const lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        // max length bits
        lbt = max(lt)
        // max dist bits
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else throw 'invalid block type';
      if (pos > tbts) throw 'unexpected EOF';
    }
    // Make sure the buffer can hold this + the largest possible addition
    // Maximum chunk size (practically, theoretically infinite) is 2^17;
    if (noBuf) cbuf(bt + 131072);
    const lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    const mxa = lbt + dbt + 18;
    while (noSt || pos + mxa < tbts) {
      // bits read, code
      const c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
      pos += c & 15;
      if (pos > tbts) throw 'unexpected EOF';
      if (!c) throw 'invalid length/literal';
      if (sym < 256) buf[bt++] = sym;
      else if (sym == 256) {
        lm = null;
        break;
      }
      else {
        let add = sym - 254;
        // no extra bits needed if less
        if (sym > 264) {
          // index
          const i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        // dist
        const d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
        if (!d) throw 'invalid distance';
        pos += d & 15;
        let dt = fd[dsym];
        if (dsym > 3) {
          const b = fdeb[dsym];
          dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
        }
        if (pos > tbts) throw 'unexpected EOF';
        if (noBuf) cbuf(bt + 131072);
        const end = bt + add;
        for (; bt < end; bt += 4) {
          buf[bt] = buf[bt - dt];
          buf[bt + 1] = buf[bt + 1 - dt];
          buf[bt + 2] = buf[bt + 2 - dt];
          buf[bt + 3] = buf[bt + 3 - dt];
        }
        bt = end;
      }
    }
    st.l = lm, st.p = pos, st.b = bt;
    if (lm) final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final)
  return bt == buf.length ? buf : slc(buf, 0, bt);
}

// starting at p, write the minimum number of bits that can hold v to d
const wbits = (d: Uint8Array, p: number, v: number) => {
  v <<= p & 7;
  const o = (p / 8) >> 0;
  d[o] |= v;
  d[o + 1] |= v >>> 8;
}

// starting at p, write the minimum number of bits (>8) that can hold v to d
const wbits16 = (d: Uint8Array, p: number, v: number) => {
  v <<= p & 7;
  const o = (p / 8) >> 0;
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
  if (!s) return [new u8(0), 0] as const;
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
  return [cl.subarray(0, cli), s] as const;
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
  const o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >>> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;
  for (let i = 0; i < s; ++i) out[o + i + 4] = dat[i];
  return (o + 4 + s) * 8;
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
  if (flen <= ftlen && flen <= dtlen) return wfblk(out, p, dat.subarray(bs, bs + bl));
  let lm: Uint16Array, ll: Uint8Array, dm: Uint16Array, dl: Uint8Array;
  wbits(out, p, 1 + (dtlen < ftlen as unknown as number)), p += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    const llm = hMap(lct, mlcb, 0);
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
    lm = flm, ll = flt, dm = fdm, dl = fdt;
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
const deo = /*#__PURE__*/ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);

// empty
const et = /*#__PURE__*/new u8(0);

// compresses data into a raw DEFLATE buffer
const dflt = (dat: Uint8Array, lvl: number, plvl: number, pre: number, post: number, lst: 0 | 1) => {
  const s = dat.length;
  const o = new u8(pre + s + 5 * (1 + Math.floor(s / 7000)) + post);
  // writing to this writes to the output buffer
  const w = o.subarray(pre, o.length - post);
  let pos = 0;
  if (!lvl || s < 8) {
    for (let i = 0; i <= s; i += 65535) {
      // end
      const e = i + 65535;
      if (e < s) {
        // write full block
        pos = wfblk(w, pos, dat.subarray(i, e));
      } else {
        // write final block
        w[i] = lst;
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
          const maxn = Math.min(n, rem) - 1;
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
                if (nl > maxn) break;
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
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
    // this is the easiest way to avoid needing to maintain state
    if (!lst) pos = wfblk(w, pos, et);
  }
  return slc(o, 0, pre + shft(pos) + post);
}

// crc check
type CRCV = {
  p(d: Uint8Array): void;
  d(): number;
};

// CRC32 table
const crct = /*#__PURE__*/ (() => {
  const t = new u32(256);
  for (let i = 0; i < 256; ++i) {
    let c = i, k = 9;
    while (--k) c = ((c & 1) && 0xEDB88320) ^ (c >>> 1);
    t[i] = c;
  }
  return t;
})();

// CRC32
const crc = (): CRCV => {
  let c = 0xFFFFFFFF;
  return {
    p(d) {
      // closures have awful performance
      let cr = c;
      for (let i = 0; i < d.length; ++i) cr = crct[(cr & 255) ^ d[i]] ^ (cr >>> 8);
      c = cr;
    },
    d() { return c ^ 0xFFFFFFFF }
  }
}

// Alder32
const adler = (): CRCV => {
  let a = 1, b = 0;
  return {
    p(d) {
      // closures have awful performance
      let n = a, m = b;
      const l = d.length;
      for (let i = 0; i != l;) {
        const e = Math.min(i + 5552, l);
        for (; i < e; ++i) n += d[i], m += n;
        n %= 65521, m %= 65521;
      }
      a = n, b = m;
    },
    d() { return ((a >>> 8) << 16 | (b & 255) << 8 | (b >>> 8)) + ((a & 255) << 23) * 2; }
  }
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
   * If you're using GZIP, set this to 0 to avoid revealing a modification date entirely.
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
 * Handler for data (de)compression streams
 * @param data The data output from the stream processor
 * @param final Whether this is the final block
 */
export type FlateStreamHandler = (data: Uint8Array, final: boolean) => void;

/**
 * Handler for asynchronous data (de)compression streams
 * @param err Any error that occurred
 * @param data The data output from the stream processor
 * @param final Whether this is the final block
 */
export type AsyncFlateStreamHandler = (err: Error, data: Uint8Array, final: boolean) => void;

/**
 * Callback for asynchronous (de)compression methods
 * @param err Any error that occurred
 * @param data The resulting data. Only present if `err` is null
 */
export type FlateCallback = (err: Error | string, data: Uint8Array) => void;

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

// deflate with opts
const dopt = (dat: Uint8Array, opt: DeflateOptions, pre: number, post: number, st?: boolean) =>
  dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : (12 + opt.mem), pre, post, !st as unknown as 0 | 1);

// Walmart object spread
const mrg = <T extends {}>(a: T, b: T) => {
  const o = {} as T;
  for (const k in a) o[k] = a[k];
  for (const k in b) o[k] = b[k];
  return o;
}

// worker clone

// This is possibly the craziest part of the entire codebase, despite how simple it may seem.
// The only parameter to this function is a closure that returns an array of variables outside of the function scope.
// We're going to try to figure out the variable names used in the closure as strings because that is crucial for workerization.
// We will return an object mapping of true variable name to value (basically, the current scope as a JS object).
// The reason we can't just use the original variable names is minifiers mangling the toplevel scope.

// This took me three weeks to figure out how to do.
const wcln = (fn: () => unknown[], fnStr: string, td: Record<string, unknown>) => {
  const dt = fn();
  const st = fn.toString();
  const ks = st.slice(st.indexOf('[') + 1, st.lastIndexOf(']')).replace(/ /g, '').split(',');
  for (let i = 0; i < dt.length; ++i) {
    let v = dt[i], k = ks[i];
    if (typeof v == 'function') {
      fnStr += ';' + k + '=';
      const st = v.toString();
      if (v.prototype) {
        // for global objects
        if (st.indexOf('[native code]') != -1) {
          const spInd = st.indexOf(' ', 8) + 1;
          fnStr += st.slice(spInd, st.indexOf('(', spInd));
        } else {
          fnStr += st;
          for (const t in v.prototype) fnStr += ';' + k + '.prototype.' + t + '=' + v.prototype[t].toString();
        }
      } else fnStr += st;
    } else td[k] = v;
  }
  return [fnStr, td] as const;
}

type CachedWorker = readonly [string, Record<string, unknown>];

const ch: CachedWorker[] = [];
// clone bufs
const cbfs = (v: Record<string, unknown>) => {
  const tl: ArrayBuffer[] = [];
  for (const k in v) {
    if (v[k] instanceof u8 || v[k] instanceof u16 || v[k] instanceof u32) tl.push((v[k] = new (v[k].constructor as typeof u8)(v[k] as Uint8Array)).buffer);
  }
  return tl;
}

// use a worker to execute code
const wrkr = <T, R>(fns: (() => unknown[])[], init: (ev: MessageEvent<T>) => void, id: number, cb: (err: Error, msg: R) => void) => {
  if (!ch[id]) {
    let fnStr = '', td: Record<string, unknown> = {}, m = fns.length - 1;
    for (let i = 0; i < m; ++i)
      [fnStr, td] = wcln(fns[i], fnStr, td);
    ch[id] = wcln(fns[m], fnStr, td);
  }
  const td = mrg({}, ch[id][1]);
  return wk(ch[id][0] + ';onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=' + init.toString() + '}', id, td, cbfs(td), cb);
}

// base async inflate fn
const bInflt = () => [u8, u16, u32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, hMap, max, bits, bits16, shft, slc, inflt, inflateSync, pbf, gu8];
const bDflt = () => [u8, u16, u32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf]

// gzip extra
const gze = () => [gzh, gzhl, wbytes, crc, crct];
// gunzip extra
const guze = () => [gzs, gzl];
// zlib extra
const zle = () => [zlh, wbytes, adler];
// unzlib extra
const zule = () => [zlv];

// post buf
const pbf = (msg: Uint8Array) => (postMessage as Worker['postMessage'])(msg, [msg.buffer]);

// get u8
const gu8 = (o?: AsyncInflateOptions) => o && o.size && new u8(o.size);

// async helper
const cbify = <T extends AsyncOptions>(dat: Uint8Array, opts: T, fns: (() => unknown[])[], init: (ev: MessageEvent<[Uint8Array, T]>) => void, id: number, cb: FlateCallback) => {
  const w = wrkr<[Uint8Array, T], Uint8Array>(
    fns,
    init,
    id,
    (err, dat) => {
      w.terminate();
      cb(err, dat);
    }
  );
  if (!opts.consume) dat = new u8(dat);
  w.postMessage([dat, opts], [dat.buffer]);
  return () => { w.terminate(); };
}

type CmpDecmpStrm = Inflate | Deflate | Gzip | Gunzip | Zlib | Unzlib;

// auto stream
const astrm = (strm: CmpDecmpStrm) => {
  strm.ondata = (dat, final) => (postMessage as Worker['postMessage'])([dat, final], [dat.buffer]);
  return (ev: MessageEvent<[Uint8Array, boolean]>) => strm.push(ev.data[0], ev.data[1]);
}

type Astrm = { ondata: AsyncFlateStreamHandler; push: (d: Uint8Array, f?: boolean) => void; terminate: AsyncTerminable; };

// async stream attach
const astrmify = <T>(fns: (() => unknown[])[], strm: Astrm, opts: T | 0, init: (ev: MessageEvent<T>) => void, id: number) => {
  let t: boolean;
  const w = wrkr<T, [Uint8Array, boolean]>(
    fns,
    init,
    id,
    (err, dat) => {
      if (err) w.terminate(), strm.ondata.call(strm, err);
      else {
        if (dat[1]) w.terminate();
        strm.ondata.call(strm, err, dat[0], dat[1]);
      }
    }
  )
  w.postMessage(opts);
  strm.push = function(d, f) {
    if (t) throw 'stream finished';
    if (!strm.ondata) throw 'no stream handler';
    w.postMessage([d, t = f], [d.buffer]);
  };
  strm.terminate = () => { w.terminate(); };
}

// read 2 bytes
const b2 = (d: Uint8Array, b: number) => d[b] | (d[b + 1] << 8);

// read 4 bytes
const b4 = (d: Uint8Array, b: number) => (d[b] | (d[b + 1] << 8) | (d[b + 2] << 16)) + (d[b + 3] << 23) * 2;

// write bytes
const wbytes = (d: Uint8Array, b: number, v: number) => {
  for (; v; ++b) d[b] = v, v >>>= 8;
}

// gzip header
const gzh = (c: Uint8Array, o: GzipOptions) => {
  const fn = o.filename;
  c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3; // assume Unix
  if (o.mtime != 0) wbytes(c, 4, Math.floor((new Date(o.mtime as (string | number) || Date.now()) as unknown as number) / 1000));
  if (fn) {
    c[3] = 8;
    for (let i = 0; i <= fn.length; ++i) c[i + 10] = fn.charCodeAt(i);
  }
}

// gzip footer: -8 to -4 = CRC, -4 to -0 is length

// gzip start
const gzs = (d: Uint8Array) => {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8) throw 'invalid gzip data';
  const flg = d[3];
  let st = 10;
  if (flg & 4) st += d[10] | (d[11] << 8) + 2;
  for (let zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++] as unknown as number);
  return st + (flg & 2);
}

// gzip length
const gzl = (d: Uint8Array) => {
  const l = d.length;
  return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16) + (2 * (d[l - 1] << 23));
}

// gzip header length
const gzhl = (o: GzipOptions) => 10 + ((o.filename && (o.filename.length + 1)) || 0);

// zlib header
const zlh = (c: Uint8Array, o: ZlibOptions) => {
  const lv = o.level, fl = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
  c[0] = 120, c[1] = (fl << 6) | (fl ? (32 - 2 * fl) : 1);
}

// zlib valid
const zlv = (d: Uint8Array) => {
  if ((d[0] & 15) != 8 || (d[0] >>> 4) > 7 || ((d[0] << 8 | d[1]) % 31)) throw 'invalid zlib data';
  if (d[1] & 32) throw 'invalid zlib data: preset dictionaries not supported';
}

/**
 * Creates an asynchronous compression stream
 * @param opts The compression options
 * @param cb The callback to call whenever data is deflated
 */
function AsyncCmpStrm<T>(opts: T, cb?: AsyncFlateStreamHandler): T;
/**
 * Creates an asynchronous compression stream
 * @param cb The callback to call whenever data is deflated
 */
function AsyncCmpStrm<T>(cb?: AsyncFlateStreamHandler): T;
function AsyncCmpStrm<T>(opts?: T | AsyncFlateStreamHandler, cb?: AsyncFlateStreamHandler): T {
  if (!cb && typeof opts == 'function') cb = opts as AsyncFlateStreamHandler, opts = {} as T;
  this.ondata = cb as AsyncFlateStreamHandler;
  return opts as T;
}

// zlib footer: -4 to -0 is Adler32

/**
 * Streaming DEFLATE compression
 */
export class Deflate {
  /**
   * Creates a DEFLATE stream
   * @param opts The compression options
   * @param cb The callback to call whenever data is deflated
   */
  constructor(opts: DeflateOptions, cb?: FlateStreamHandler);
  constructor(cb?: FlateStreamHandler);
  constructor(opts?: DeflateOptions | FlateStreamHandler, cb?: FlateStreamHandler) {
    if (!cb && typeof opts == 'function') cb = opts as FlateStreamHandler, opts = {};
    this.ondata = cb;
    this.o = (opts as DeflateOptions) || {};
  }
  private o: DeflateOptions;
  private d: boolean;
  /**
   * The handler to call whenever data is available
   */
  ondata: FlateStreamHandler;

  private p(c: Uint8Array, f: boolean) {
    this.ondata(dopt(c, this.o, 0, 0, !f), f);
  }

  /**
   * Pushes a chunk to be deflated
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  push(chunk: Uint8Array, final?: boolean) {
    if (this.d) throw 'stream finished';
    if (!this.ondata) throw 'no stream handler';
    this.d = final;
    this.p(chunk, final || false);
  }
}

/**
 * Asynchronous streaming DEFLATE compression
 */
export class AsyncDeflate {
  /**
   * The handler to call whenever data is available
   */
  ondata: AsyncFlateStreamHandler;

  /**
   * Creates an asynchronous DEFLATE stream
   * @param opts The compression options
   * @param cb The callback to call whenever data is deflated
   */
  constructor(opts: DeflateOptions, cb?: AsyncFlateStreamHandler);
  /**
   * Creates an asynchronous DEFLATE stream
   * @param cb The callback to call whenever data is deflated
   */
  constructor(cb?: AsyncFlateStreamHandler);
  constructor(opts?: DeflateOptions | AsyncFlateStreamHandler, cb?: AsyncFlateStreamHandler) {
    astrmify([
      bDflt,
      () => [astrm, Deflate]
    ], this as unknown as Astrm, AsyncCmpStrm.call(this, opts, cb), ev => {
      const strm = new Deflate(ev.data);
      onmessage = astrm(strm);
    }, 6);
  }

  /**
   * Pushes a chunk to be deflated
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  // @ts-ignore
  push(chunk: Uint8Array, final?: boolean): void;
  
  /**
   * A method to terminate the stream's internal worker. Subsequent calls to
   * push() will silently fail.
   */
  terminate: AsyncTerminable;
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
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts as AsyncDeflateOptions, [
    bDflt,
  ], ev => pbf(deflateSync(ev.data[0], ev.data[1])), 0, cb);
}

/**
 * Compresses data with DEFLATE without any wrapper
 * @param data The data to compress
 * @param opts The compression options
 * @returns The deflated version of the data
 */
export function deflateSync(data: Uint8Array, opts: DeflateOptions = {}) {
  return dopt(data, opts, 0, 0);
}

/**
 * Streaming DEFLATE decompression
 */
export class Inflate {
  /**
   * Creates an inflation stream
   * @param cb The callback to call whenever data is inflated
   */
  constructor(cb?: FlateStreamHandler) { this.ondata = cb; }
  private s: InflateState = {};
  private o: Uint8Array;
  private p = new u8(0);
  private d: boolean;
  /**
   * The handler to call whenever data is available
   */
  ondata: FlateStreamHandler;

  private e(c: Uint8Array) {
    if (this.d) throw 'stream finished';
    if (!this.ondata) throw 'no stream handler';
    const l = this.p.length;
    const n = new u8(l + c.length);
    n.set(this.p), n.set(c, l), this.p = n;
  }

  private c(final: boolean) {
    this.d = this.s.i = final || false;
    const bts = this.s.b;
    const dt = inflt(this.p, this.o, this.s);
    this.ondata(slc(dt, bts, this.s.b), this.d);
    this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
    this.p = slc(this.p, (this.s.p / 8) >> 0), this.s.p &= 7;
  }

  /**
   * Pushes a chunk to be inflated
   * @param chunk The chunk to push
   * @param final Whether this is the final chunk
   */
  push(chunk: Uint8Array, final?: boolean) {
    this.e(chunk), this.c(final);
  }
}

/**
 * Asynchronous streaming DEFLATE decompression
 */
export class AsyncInflate {
  /**
   * The handler to call whenever data is available
   */
  ondata: AsyncFlateStreamHandler;

  /**
   * Creates an asynchronous inflation stream
   * @param cb The callback to call whenever data is deflated
   */
  constructor(cb?: AsyncFlateStreamHandler) {
    this.ondata = cb;
    astrmify([
      bInflt,
      () => [astrm, Inflate]
    ], this as unknown as Astrm, 0, () => {
      const strm = new Inflate();
      onmessage = astrm(strm);
    }, 7);
  }

  /**
   * Pushes a chunk to be inflated
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  // @ts-ignore
  push(chunk: Uint8Array, final?: boolean): void;

  /**
   * A method to terminate the stream's internal worker. Subsequent calls to
   * push() will silently fail.
   */
  terminate: AsyncTerminable;
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
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts as AsyncInflateOptions, [
    bInflt
  ], ev => pbf(inflateSync(ev.data[0], gu8(ev.data[1]))), 1, cb);
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

// before you yell at me for not just using extends, my reason is that TS inheritance is hard to workerize.

/**
 * Streaming GZIP compression
 */
export class Gzip {
  private c = crc();
  private l = 0;
  private v = 1;
  private o: GzipOptions;
  /**
   * The handler to call whenever data is available
   */
  ondata: FlateStreamHandler;

  /**
   * Creates a GZIP stream
   * @param opts The compression options
   * @param cb The callback to call whenever data is deflated
   */
  constructor(opts: GzipOptions, cb?: FlateStreamHandler);
  /**
   * Creates a GZIP stream
   * @param cb The callback to call whenever data is deflated
   */
  constructor(cb?: FlateStreamHandler);
  constructor(opts?: GzipOptions | FlateStreamHandler, cb?: FlateStreamHandler) {
    Deflate.call(this, opts, cb);
  }

  /**
   * Pushes a chunk to be GZIPped
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  push(chunk: Uint8Array, final?: boolean) {
    Deflate.prototype.push.call(this, chunk, final);
  }
  
  private p(c: Uint8Array, f: boolean) {
    this.c.p(c);
    this.l += c.length;
    const raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, !f);
    if (this.v) gzh(raw, this.o), this.v = 0;
    if (f) wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
    this.ondata(raw, f);
  }
}

/**
 * Asynchronous streaming GZIP compression
 */
export class AsyncGzip {
  /**
   * The handler to call whenever data is available
   */
  ondata: AsyncFlateStreamHandler;

  /**
   * Creates an asynchronous GZIP stream
   * @param opts The compression options
   * @param cb The callback to call whenever data is deflated
   */
  constructor(opts: GzipOptions, cb?: AsyncFlateStreamHandler);
  /**
   * Creates an asynchronous GZIP stream
   * @param cb The callback to call whenever data is deflated
   */
  constructor(cb?: AsyncFlateStreamHandler);
  constructor(opts?: GzipOptions | AsyncFlateStreamHandler, cb?: AsyncFlateStreamHandler) {
    astrmify([
      bDflt,
      gze,
      () => [astrm, Deflate, Gzip]
    ], this as unknown as Astrm, AsyncCmpStrm.call(this, opts, cb), ev => {
      const strm = new Gzip(ev.data);
      onmessage = astrm(strm);
    }, 8);
  }

  /**
   * Pushes a chunk to be GZIPped
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  // @ts-ignore
  push(chunk: Uint8Array, final?: boolean): void;

  /**
   * A method to terminate the stream's internal worker. Subsequent calls to
   * push() will silently fail.
   */
  terminate: AsyncTerminable;
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
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts as AsyncGzipOptions, [
    bDflt,
    gze,
    () => [gzipSync]
  ], ev => pbf(gzipSync(ev.data[0], ev.data[1])), 2, cb);
}

/**
 * Compresses data with GZIP
 * @param data The data to compress
 * @param opts The compression options
 * @returns The gzipped version of the data
 */
export function gzipSync(data: Uint8Array, opts: GzipOptions = {}) {
  const c = crc(), l = data.length;
  c.p(data);
  const d = dopt(data, opts, gzhl(opts), 8), s = d.length;
  return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}

/**
 * Streaming GZIP decompression
 */
export class Gunzip {
  private v = 1;
  private p: Uint8Array;
  /**
   * The handler to call whenever data is available
   */
  ondata: FlateStreamHandler;

  /**
   * Creates a GUNZIP stream
   * @param cb The callback to call whenever data is inflated
   */
  constructor(cb?: FlateStreamHandler) { Inflate.call(this, cb); }

  /**
   * Pushes a chunk to be GUNZIPped
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  push(chunk: Uint8Array, final?: boolean) {
    (Inflate.prototype as unknown as { e: typeof Inflate.prototype['e'] }).e.call(this, chunk);
    if (this.v) {
      const s = gzs(this.p);
      if (s >= this.p.length && !final) return;
      this.p = this.p.subarray(s), this.v = 0;
    }
    if (final) {
      if (this.p.length < 8) throw 'invalid gzip stream';
      this.p = this.p.subarray(0, -8);
    }
    // necessary to prevent TS from using the closure value
    // This allows for workerization to function correctly
    (Inflate.prototype as unknown as { c: typeof Inflate.prototype['c'] }).c.call(this, final);
  }
}

/**
 * Asynchronous streaming GZIP decompression
 */
export class AsyncGunzip {
  /**
   * The handler to call whenever data is available
   */
  ondata: AsyncFlateStreamHandler;

  /**
   * Creates an asynchronous GUNZIP stream
   * @param cb The callback to call whenever data is deflated
   */
  constructor(cb: AsyncFlateStreamHandler) {
    this.ondata = cb;
    astrmify([
      bInflt,
      guze,
      () => [astrm, Inflate, Gunzip]
    ], this as unknown as Astrm, 0, () => {
      const strm = new Gunzip();
      onmessage = astrm(strm);
    }, 9);
  }

  /**
   * Pushes a chunk to be GUNZIPped
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  // @ts-ignore
  push(chunk: Uint8Array, final?: boolean): void;

  /**
   * A method to terminate the stream's internal worker. Subsequent calls to
   * push() will silently fail.
   */
  terminate: AsyncTerminable;
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
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts as AsyncGunzipOptions, [
    bInflt,
    guze,
    () => [gunzipSync]
  ], ev => pbf(gunzipSync(ev.data[0])), 3, cb);
}

/**
 * Expands GZIP data
 * @param data The data to decompress
 * @param out Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory.
 * @returns The decompressed version of the data
 */
export function gunzipSync(data: Uint8Array, out?: Uint8Array) {
  return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
}

/**
 * Streaming Zlib compression
 */
export class Zlib {
  private c = adler();
  private v = 1;
  private o: GzipOptions;
  /**
   * The handler to call whenever data is available
   */
  ondata: FlateStreamHandler;

  /**
   * Creates a Zlib stream
   * @param opts The compression options
   * @param cb The callback to call whenever data is deflated
   */
  constructor(opts: ZlibOptions, cb?: FlateStreamHandler);
  /**
   * Creates a Zlib stream
   * @param cb The callback to call whenever data is deflated
   */
  constructor(cb?: FlateStreamHandler);
  constructor(opts?: ZlibOptions | FlateStreamHandler, cb?: FlateStreamHandler) {
    Deflate.call(this, opts, cb);
  }

  /**
   * Pushes a chunk to be zlibbed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  push(chunk: Uint8Array, final?: boolean) {
    Deflate.prototype.push.call(this, chunk, final);
  }
  
  private p(c: Uint8Array, f: boolean) {
    this.c.p(c);
    const raw = dopt(c, this.o, this.v && 2, f && 4, !f);
    if (this.v) zlh(raw, this.o), this.v = 0;
    if (f) wbytes(raw, raw.length - 4, this.c.d());
    this.ondata(raw, f);
  }
}

/**
 * Asynchronous streaming Zlib compression
 */
export class AsyncZlib {
  /**
   * The handler to call whenever data is available
   */
  ondata: AsyncFlateStreamHandler;

  /**
   * Creates an asynchronous DEFLATE stream
   * @param opts The compression options
   * @param cb The callback to call whenever data is deflated
   */
  constructor(opts: ZlibOptions, cb?: AsyncFlateStreamHandler);
  /**
   * Creates an asynchronous DEFLATE stream
   * @param cb The callback to call whenever data is deflated
   */
  constructor(cb?: AsyncFlateStreamHandler);
  constructor(opts?: ZlibOptions | AsyncFlateStreamHandler, cb?: AsyncFlateStreamHandler) {
    astrmify([
      bDflt,
      zle,
      () => [astrm, Deflate, Zlib]
    ], this as unknown as Astrm, AsyncCmpStrm.call(this, opts, cb), ev => {
      const strm = new Zlib(ev.data);
      onmessage = astrm(strm);
    }, 10);
  }

  /**
   * Pushes a chunk to be deflated
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  // @ts-ignore
  push(chunk: Uint8Array, final?: boolean): void;

  /**
   * A method to terminate the stream's internal worker. Subsequent calls to
   * push() will silently fail.
   */
  terminate: AsyncTerminable;
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
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts as AsyncZlibOptions, [
    bDflt,
    zle,
    () => [zlibSync]
  ], ev => pbf(zlibSync(ev.data[0], ev.data[1])), 4, cb);
}

/**
 * Compress data with Zlib
 * @param data The data to compress
 * @param opts The compression options
 * @returns The zlib-compressed version of the data
 */
export function zlibSync(data: Uint8Array, opts: ZlibOptions = {}) {
  const a = adler();
  a.p(data);
  const d = dopt(data, opts, 2, 4);
  return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}

/**
 * Streaming Zlib decompression
 */
export class Unzlib {
  private v = 1;
  private p: Uint8Array;
  /**
   * The handler to call whenever data is available
   */
  ondata: FlateStreamHandler;
  /**
   * Creates a Zlib decompression stream
   * @param cb The callback to call whenever data is inflated
   */
  constructor(cb?: FlateStreamHandler) { Inflate.call(this, cb); }

  /**
   * Pushes a chunk to be unzlibbed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  push(chunk: Uint8Array, final?: boolean) {
    (Inflate.prototype as unknown as { e: typeof Inflate.prototype['e'] }).e.call(this, chunk);
    if (this.v) {
      if (this.p.length < 2 && !final) return;
      this.p = this.p.subarray(2), this.v = 0;
    }
    if (final) {
      if (this.p.length < 4) throw 'invalid zlib stream';
      this.p = this.p.subarray(0, -4);
    }
    // necessary to prevent TS from using the closure value
    // This allows for workerization to function correctly
    (Inflate.prototype as unknown as { c: typeof Inflate.prototype['c'] }).c.call(this, final);
  }
}

/**
 * Asynchronous streaming Zlib decompression
 */
export class AsyncUnzlib {
  /**
   * The handler to call whenever data is available
   */
  ondata: AsyncFlateStreamHandler;

  /**
   * Creates an asynchronous Zlib decompression stream
   * @param cb The callback to call whenever data is deflated
   */
  constructor(cb?: AsyncFlateStreamHandler) {
    this.ondata = cb;
    astrmify([
      bInflt,
      zule,
      () => [astrm, Inflate, Unzlib]
    ], this as unknown as Astrm, 0, () => {
      const strm = new Unzlib();
      onmessage = astrm(strm);
    }, 11);
  }

  /**
   * Pushes a chunk to be decompressed from Zlib
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  // @ts-ignore
  push(chunk: Uint8Array, final?: boolean): void;

  /**
   * A method to terminate the stream's internal worker. Subsequent calls to
   * push() will silently fail.
   */
  terminate: AsyncTerminable;
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
  if (typeof cb != 'function') throw 'no callback';
  return cbify(data, opts as AsyncUnzlibOptions, [
    bInflt,
    zule,
    () => [unzlibSync]
  ], ev => pbf(unzlibSync(ev.data[0], gu8(ev.data[1]))), 5, cb);
}

/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
export function unzlibSync(data: Uint8Array, out?: Uint8Array) {
  return inflt((zlv(data), data.subarray(2, -4)), out);
}

// Default algorithm for compression (used because having a known output size allows faster decompression)
export { gzip as compress, AsyncGzip as AsyncCompress }
// Default algorithm for compression (used because having a known output size allows faster decompression)
export { gzipSync as compressSync, Gzip as Compress }

/**
 * Streaming GZIP, Zlib, or raw DEFLATE decompression
 */
export class Decompress {
  private G = Gunzip;
  private I = Inflate;
  private Z = Unzlib;
  /**
   * Creates a decompression stream
   * @param cb The callback to call whenever data is decompressed
   */
  constructor(cb?: FlateStreamHandler) { this.ondata = cb; }
  private s: Inflate | Gunzip | Unzlib;
  /**
   * The handler to call whenever data is available
   */
  ondata: FlateStreamHandler;
  private p: Uint8Array;

  /**
   * Pushes a chunk to be decompressed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  push(chunk: Uint8Array, final?: boolean) {
    if (!this.ondata) throw 'no stream handler';
    if (!this.s) {
      if (this.p && this.p.length) {
        const n = new u8(this.p.length + chunk.length);
        n.set(this.p), n.set(chunk, this.p.length);
      } else this.p = chunk;
      if (this.p.length > 2) {
        const _this = this;
        const cb: FlateStreamHandler = function() { _this.ondata.apply(_this, arguments); }
        this.s = (this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8)
          ? new this.G(cb)
          : ((this.p[0] & 15) != 8 || (this.p[0] >> 4) > 7 || ((this.p[0] << 8 | this.p[1]) % 31))
            ? new this.I(cb)
            : new this.Z(cb);
        this.s.push(this.p, final);
        this.p = null;
      }
    } else this.s.push(chunk, final);
  }
}

/**
 * Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression
 */
export class AsyncDecompress {
  private G = AsyncGunzip;
  private I = AsyncInflate;
  private Z = AsyncUnzlib;
    /**
   * Creates an asynchronous decompression stream
   * @param cb The callback to call whenever data is decompressed
   */
  constructor(cb?: AsyncFlateStreamHandler) { this.ondata = cb; }
  
  /**
   * The handler to call whenever data is available
   */
  ondata: AsyncFlateStreamHandler;

  /**
   * Pushes a chunk to be decompressed
   * @param chunk The chunk to push
   * @param final Whether this is the last chunk
   */
  push(chunk: Uint8Array, final?: boolean) {
    Decompress.prototype.push.call(this, chunk, final);
  }
}

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
  if (typeof cb != 'function') throw 'no callback';
  return (data[0] == 31 && data[1] == 139 && data[2] == 8)
    ? gunzip(data, opts as AsyncInflateOptions, cb)
    : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
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
  return (data[0] == 31 && data[1] == 139 && data[2] == 8)
    ? gunzipSync(data, out)
    : ((data[0] & 15) != 8 || (data[0] >> 4) > 7 || ((data[0] << 8 | data[1]) % 31))
      ? inflateSync(data, out)
      : unzlibSync(data, out);
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
 * Options for asynchronously expanding a ZIP archive
 */
export interface AsyncUnzipOptions extends AsyncOptions {}

/**
 * A file that can be used to create a ZIP archive
 */
export type ZippableFile = Uint8Array | [Uint8Array, ZipOptions];

/**
 * A file that can be used to asynchronously create a ZIP archive
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
export type UnzipCallback = (err: Error | string, data: Unzipped) => void;

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

/**
 * Converts a string into a Uint8Array for use with compression/decompression methods
 * @param str The string to encode
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless decoding a binary string.
 * @returns The string encoded in UTF-8/Latin-1 binary
 */
export function strToU8(str: string, latin1?: boolean): Uint8Array {
  const l = str.length;
  if (!latin1 && typeof TextEncoder != 'undefined') return new TextEncoder().encode(str);
  let ar = new u8(str.length + (str.length >>> 1));
  let ai = 0;
  const w = (v: number) => { ar[ai++] = v; };
  for (let i = 0; i < l; ++i) {
    if (ai + 5 > ar.length) {
      const n = new u8(ai + 8 + ((l - i) << 1));
      n.set(ar);
      ar = n;
    }
    let c = str.charCodeAt(i);
    if (c < 128 || latin1) w(c);
    else if (c < 2048) w(192 | (c >>> 6)), w(128 | (c & 63));
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | (str.charCodeAt(++i) & 1023),
      w(240 | (c >>> 18)), w(128 | ((c >>> 12) & 63)), w(128 | ((c >>> 6) & 63)), w(128 | (c & 63));
    else w(224 | (c >>> 12)), w(128 | ((c >>> 6) & 63)), w(128 | (c & 63));
  }
  return slc(ar, 0, ai);
}

/**
 * Converts a Uint8Array to a string
 * @param dat The data to decode to string
 * @param latin1 Whether or not to interpret the data as Latin-1. This should
 *               not need to be true unless encoding to binary string.
 * @returns The original UTF-8/Latin-1 string
 */
export function strFromU8(dat: Uint8Array, latin1?: boolean) {
  let r = '';
  if (!latin1 && typeof TextDecoder != 'undefined') return new TextDecoder().decode(dat);
  for (let i = 0; i < dat.length;) {
    let c = dat[i++];
    if (c < 128 || latin1) r += String.fromCharCode(c);
    else if (c < 224) r += String.fromCharCode((c & 31) << 6 | (dat[i++] & 63));
    else if (c < 240) r += String.fromCharCode((c & 15) << 12 | (dat[i++] & 63) << 6 | (dat[i++] & 63));
    else
      c = ((c & 15) << 18 | (dat[i++] & 63) << 12 | (dat[i++] & 63) << 6 | (dat[i++] & 63)) - 65536,
      r += String.fromCharCode(55296 | (c >> 10), 56320 | (c & 1023));
  }
  return r;
};

// skip local zip header
const slzh = (d: Uint8Array, b: number) => b + 30 + b2(d, b + 26) + b2(d, b + 28);

// read zip header
const zh = (d: Uint8Array, b: number, z: boolean) => {
  const fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
  const [sc, su, off] = z ? z64e(d, es) : [b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)];
  return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off] as const;
}

// read zip64 extra field
const z64e = (d: Uint8Array, b: number) => {
  for (; b2(d, b) != 1; b += 4 + b2(d, b + 2));
  return [b4(d, b + 12), b4(d, b + 4), b4(d, b + 20)] as const;
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
  wbytes(d, b, ((y << 24) * 2) | ((dt.getMonth() + 1) << 21) | (dt.getDate() << 16) | (dt.getHours() << 11) | (dt.getMinutes() << 5) | (dt.getSeconds() >>> 1));
  b += 4;
  wbytes(d, b, c);
  wbytes(d, b + 4, l);
  wbytes(d, b + 8, su);
  wbytes(d, b + 12, fl), b += 16; // skip extra field, comment
  if (ce != null) wbytes(d, b += 10, ce), b += 4;
  d.set(fn, b);
  b += fl;
  if (ce == null) d.set(cmp, b);
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

// TODO: Support streams as ZIP input

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
  if (typeof cb != 'function') throw 'no callback';
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
      try {
        wzh(out, tot, f.c, f.d, f.m, f.n, f.u, f.p, null, f.t);
        wzh(out, o, f.c, f.d, f.m, f.n, f.u, f.p, tot, f.t), o += 46 + f.n.length, tot += 30 + f.n.length + f.d.length;
      } catch(e) {
        return cb(e, null);
      }
    }
    wzf(out, o, files.length, cdl, oe);
    cb(null, out);
  }
  if (!lft) cbf();
  // Cannot use lft because it can decrease
  for (let i = 0; i < slft; ++i) {
    const fn = k[i];
    const [file, p] = r[fn];
    const c = crc(), m = file.length;
    c.p(file);
    const n = strToU8(fn), s = n.length;
    const t = p.level == 0 ? 0 : 8;
    const cbl: FlateCallback = (e, d) => {
      if (e) {
        tAll();
        cb(e, null);
      } else {
        const l = d.length;
        files[i] = {
          t,
          d,
          m,
          c: c.d(),
          u: fn.length != l,
          n,
          p
        };
        o += 30 + s + l;
        tot += 76 + 2 * s + l;
        if (!--lft) cbf();
      }
    }
    if (n.length > 65535) cbl('filename too long', null);
    if (!t) cbl(null, file);
    else if (m < 160000) {
      try {
        cbl(null, deflateSync(file, p));
      } catch(e) {
        cbl(e, null);
      }
    } else term.push(deflate(file, p, cbl));
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
    const n = strToU8(fn), s = n.length;
    if (n.length > 65535) throw 'filename too long';
    const d = t ? deflateSync(file, p) : file, l = d.length;
    const c = crc();
    c.p(file);
    files.push({
      t,
      d,
      m: file.length,
      c: c.d(),
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
  if (typeof cb != 'function') throw 'no callback';
  const term: AsyncTerminable[] = [];
  const tAll = () => {
    for (let i = 0; i < term.length; ++i) term[i]();
  }
  const files: Unzipped = {};
  let e = data.length - 22;
  for (; b4(data, e) != 0x6054B50; --e) {
    if (!e || data.length - e > 65558) {
      cb('invalid zip file', null);
      return;
    }
  };
  let lft = b2(data, e + 8);
  if (!lft) cb(null, {});
  let c = lft;
  let o = b4(data, e + 16);
  const z = o == 4294967295;
  if (z) {
    e = b4(data, e - 12);
    if (b4(data, e) != 0x6064B50) throw 'invalid zip file';
    c = lft = b4(data, e + 32);
    o = b4(data, e + 48);
  }
  for (let i = 0; i < c; ++i) {
    const [c, sc, su, fn, no, off] = zh(data, o, z), b = slzh(data, off);
    o = no
    const cbl: FlateCallback = (e, d) => {
      if (e) {
        tAll();
        cb(e, null);
      } else {
        files[fn] = d;
        if (!--lft) cb(null, files);
      }
    }
    if (!c) cbl(null, slc(data, b, b + sc))
    else if (c == 8) {
      const infl = data.subarray(b, b + sc);
      if (sc < 320000) {
        try {
          cbl(null, inflateSync(infl, new u8(su)));
        } catch(e) {
          cbl(e, null);
        }
      }
      else term.push(inflate(infl, { size: su }, cbl));
    } else cbl('unknown compression type ' + c, null);
  }
  return tAll;
}

/**
 * Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
 * performance with more than one file.
 * @param data The raw compressed ZIP file
 * @returns The decompressed files
 */
export function unzipSync(data: Uint8Array) {
  const files: Unzipped = {};
  let e = data.length - 22;
  for (; b4(data, e) != 0x6054B50; --e) {
    if (!e || data.length - e > 65558) throw 'invalid zip file';
  };
  let c = b2(data, e + 8);
  if (!c) return {};
  let o = b4(data, e + 16);
  const z = o == 4294967295;
  if (z) {
    e = b4(data, e - 12);
    if (b4(data, e) != 0x6064B50) throw 'invalid zip file';
    c = b4(data, e + 32);
    o = b4(data, e + 48);
  }
  for (let i = 0; i < c; ++i) {
    const [c, sc, su, fn, no, off] = zh(data, o, z), b = slzh(data, off);
    o = no;
    if (!c) files[fn] = slc(data, b, b + sc);
    else if (c == 8) files[fn] = inflateSync(data.subarray(b, b + sc), new u8(su));
    else throw 'unknown compression type ' + c;
  }
  return files;
}