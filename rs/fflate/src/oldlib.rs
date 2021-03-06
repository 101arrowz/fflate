//! fflate - a fast, efficient, pure compression library
//!
//!

// Instead of trying to read this code, check out the TypeScript version

#![allow(non_upper_case_globals)]
// #![cfg_attr(not(feature = "std"), no_std)]
use lazy_static::lazy_static;

// #[cfg(feature = "std")]
use std::{vec::Vec, io::{Read, Write, Error, ErrorKind}, ops::Range};

const fleb: [usize; 32] = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0,
];

const fl: [u16; 32] = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131,
    163, 195, 227, 258, 0, 0, 0,
];

// in theory, this could be computed, but embedding it at compile time is faster.
const flt: [u8; 288] = [
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8,
];

const fdeb: [usize; 32] = [
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13,
    13, 0, 0,
];

const fd: [u16; 32] = [
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537,
    2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0,
];

const fdt: [u8; 31] = [5u8; 31];

const clim: [usize; 19] = [
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
];

const et: [u8; 0] = [];

fn freb(b: &[u16], r: &mut [u32]) {
    for i in 1..30 {
        let base = b[i];
        for j in base..b[i + 1] {
            r[j as usize] = ((j - base) << 5) as u32 | i as u32;
        }
    }
}

// hmap base
fn hmb(cd: &[u8], mb: u8, le: &mut [u16]) {
    let t = (mb + 1) as usize;
    le.iter_mut().for_each(|v| *v = 0);
    for &cl in cd {
        if cl != 0 {
            le[cl as usize] += 1;
        }
    }
    let mut v = 0;
    for i in 1..t {
        let val = le[i];
        le[i] = v;
        v = (v + val) << 1;
    }
}

fn hmap(cd: &[u8], mb: u8, co: &mut [u16], le: &mut [u16]) {
    hmb(cd, mb, le);
    for i in 0..cd.len() {
        let cl = cd[i] as usize;
        let v = rev[le[cl] as usize] >> (15 - cl);
        le[cl] += 1;
        co[i] = v as u16;
    }
}

fn hrmap(cd: &[u8], mb: u8, co: &mut [u16], le: &mut [u16]) {
    hmb(cd, mb, le);
    let rvb = 15 - mb;
    let mbu = mb as usize;
    for i in 0..cd.len() {
        let cl = cd[i] as usize;
        if cl != 0 {
            let r = mbu - cl;
            let v = (le[cl] << r) as usize;
            le[cl] += 1;
            let m = v + (1 << r);
            let sv = ((i as u16) << 4) | cl as u16;
            rev[v..m].iter().for_each(|i| co[i >> rvb] = sv);
        }
    }
}

lazy_static! {
    static ref revfl: [u32; 261] = {
        let mut v = [0u32; 261];
        freb(&fl, &mut v);
        v[258] = 28;
        v
    };
    static ref revfd: [u32; 32769] = {
        let mut v = [0u32; 32769];
        freb(&fd, &mut v);
        v
    };
    static ref rev: [usize; 32768] = {
        let mut v = [0usize; 32768];
        for i in 0..32768 {
            let mut el = ((i & 0xAAAA) >> 1) | ((i & 0x5555) << 1);
            el = ((el & 0xCCCC) >> 2) | ((el & 0x3333) << 2);
            el = ((el & 0xF0F0) >> 4) | ((el & 0x0F0F) << 4);
            v[i] = (((el & 0xFF00) >> 8) | ((el & 0x00FF) << 8)) >> 1;
        }
        v
    };
    static ref flm: [u16; 288] = {
        let mut v = [0u16; 288];
        hmap(&flt, 9, &mut v, &mut [0u16; 16]);
        v
    };
    static ref flrm: [u16; 512] = {
        let mut v = [0u16; 512];
        hrmap(&flt, 9, &mut v, &mut [0u16; 16]);
        v
    };
    static ref fdm: [u16; 32] = {
        let mut v = [0u16; 32];
        hmap(&fdt, 5, &mut v, &mut [0u16; 16]);
        v
    };
    static ref fdrm: [u16; 32] = {
        let mut v = [0u16; 32];
        hrmap(&fdt, 5, &mut v, &mut [0u16; 16]);
        v
    };
}

#[inline(always)]
fn mbits(dat: &[u8], pos: usize, mask: u8) -> u8 {
    (dat[pos >> 3] >> (pos & 7)) & mask
}

fn mbits16(dat: &[u8], pos: usize, mask: u16) -> u16 {
    let b = pos >> 3;
    ((dat[b] as u16 | ((dat[b + 1] as u16) << 8)) >> (pos & 7)) & mask
}

#[inline(always)]
fn bits(dat: &[u8], pos: usize, mask: u8) -> u8 {
    let b = pos >> 3;
    ((dat[b] as u16 | ((dat[b + 1] as u16) << 8)) >> (pos & 7)) as u8 & mask
}

#[inline(always)]
fn bits16(dat: &[u8], pos: usize, mask: u16) -> u16 {
    let b = pos >> 3;
    ((dat[b] as u32
        | ((dat[b + 1] as u32) << 8)
        | ((dat[b + 2] as u32) << 16))
        >> (pos & 7)) as u16
        & mask
}

#[inline(always)]
fn shft(pos: usize) -> usize {
    (pos >> 3) + (pos & 7 != 0) as usize
}


struct InflateState {
    lmap: [u16; 32768],
    dmap: [u16; 32768],
    lbits: u8,
    dbits: u8,
    bfinal: bool,
    pos: usize,
    last: bool,
    head: bool,
}

impl InflateState {
    #[inline(always)]
    pub fn new() -> Self {
        Default::default()
    }
}

impl Default for InflateState {
    fn default() -> Self {
        InflateState {
            lmap: [0; 32768],
            dmap: [0; 32768],
            lbits: 0,
            dbits: 0,
            bfinal: false,
            pos: 0,
            last: false,
            head: true
        }
    }
}

pub enum InflateError {
    UnexpectedEOF,
    InvalidBlockType,
    InvalidLengthOrLiteral,
    InvalidDistance
}

// #[cfg(feature = "std")]
impl From<InflateError> for Error {
    fn from(error: InflateError) -> Self {
        Error::new(match error {
            InflateError::UnexpectedEOF => ErrorKind::UnexpectedEof,
            _ => ErrorKind::Other
        }, match error {
            InflateError::UnexpectedEOF => "unexpected EOF",
            InflateError::InvalidBlockType => "invalid block type",
            InflateError::InvalidLengthOrLiteral => "invalid length/literal",
            InflateError::InvalidDistance => "invalid distance"
        })
    }
}

fn max(dat: &[u8]) -> u8 {
    let mut m = 0;
    for &v in dat {
        if v > m {
            m = v;
        }
    }
    m
}

pub trait OutputBuffer {
    fn write(&mut self, value: u8);
    fn write_all(&mut self, slice: &[u8]) {
        for &value in slice {
            self.write(value);
        }
    }
    fn pre_alloc(&mut self, extra_bytes: usize);
    fn copy_back(&mut self, back: usize, len: usize);
}

// #[cfg(feature = "std")]
impl OutputBuffer for Vec<u8> {
    #[inline(always)]
    fn write(&mut self, value: u8) {
        self.push(value);
    }
    #[inline(always)]
    fn write_all(&mut self, slice: &[u8]) {
        self.extend(slice.iter());
    }
    #[inline(always)]
    fn pre_alloc(&mut self, extra_bytes: usize) {
        self.reserve(extra_bytes);
    }
    fn copy_back(&mut self, back: usize, mut len: usize) {
        let no_cp = len > back;
        let l = self.len();
        let st = l - back;
        if no_cp && back < 4 {
            for i in 0..len {
                OutputBuffer::write(self, self[st + i]);
            }
        } else {
            let buf = &mut [0u8; 258];
            if no_cp {
                while len != 0 {
                    let add = std::cmp::min(len, back);
                    buf[0..add].copy_from_slice(&self[st..st + add]);
                    OutputBuffer::write_all(self, &buf[0..add]);
                    len -= add;
                }
            } else {
                buf[0..len].copy_from_slice(&self[st..st + len]);
                OutputBuffer::write_all(self, &buf[0..len]);
            }
        }
    }
}

// pub struct SliceOutputBuffer<'a > {
//     buf: &'a mut [u8],
//     byte: usize
// }

// impl<'a> SliceOutputBuffer<'a> {
//     #[inline(always)]
//     pub fn new(slice: &'a mut [u8]) -> SliceOutputBuffer<'a> {
//         SliceOutputBuffer {
//             buf: slice,
//             byte: 0
//         }
//     }
// }

// impl<'a> OutputBuffer for SliceOutputBuffer<'a> {
//     #[inline(always)]
//     fn write(&mut self, value: u8) {
//         if self.byte < self.buf.len() {
//             self.buf[self.byte] = value;
//         }
//         self.byte += 1;
//     }
//     #[inline(always)]
//     fn write_all(&mut self, slice: &[u8]) {
//         let sl = slice.len();
//         let end = self.byte + sl;
//         if end <= self.buf.len() {
//             self.buf[self.byte..end].copy_from_slice(slice);
//         }
//         self.byte = end;
//     }
//     #[inline(always)]
//     fn pre_alloc(&mut self, _eb: usize) {}
//     fn copy_back(&mut self, back: usize, mut len: usize) {
//         if len > back {
//             while len != 0 {
//                 let st = self.byte - back;
//                 OutputBuffer::write_all(self, &self.buf[st..std::cmp::min(st + len as usize, self.byte)]);
//                 len -= back;
//             }
//         } else {
//             let st = self.byte - back;
//             OutputBuffer::write_all(self, &self.buf[st..st + len])
//         }
//     }

// }

fn inflt(dat: &[u8], buf: &mut dyn OutputBuffer, st: &mut InflateState) -> Result<(), InflateError> {
    let mut pos = st.pos;
    let sl = dat.len();
    if sl == 0 || (st.head && sl < 5) { return Ok(()); }
    let tbts = sl << 3;
    let mut clmap = [0u16; 128];
    let mut le = [0u16; 16];
    let mut ldt = [0u8; 320];
    let mut clt = [0u8; 19];
    loop {
        if st.head {
            st.bfinal = bits(dat, pos, 1) != 0;
            let btype = bits(dat, pos + 1, 3);
            pos += 3;
            match btype {
                0 => {
                    let s = shft(pos) + 4;
                    let t = s + (dat[s - 4] as u16 | ((dat[s - 3] as u16) << 8)) as usize;
                    if t > dat.len() {
                        if st.last {
                            return Err(InflateError::UnexpectedEOF);
                        }
                        break;
                    }
                    buf.write_all(&dat[s..t]);
                    continue;
                }
                1 => {
                    st.lmap[..512].copy_from_slice(&*flrm);
                    st.dmap[..32].copy_from_slice(&*fdrm);
                    st.lbits = 9;
                    st.dbits = 5;
                }
                2 => {
                    let hlit = bits(dat, pos, 31) as usize + 257;
                    let hclen = (bits(dat, pos + 10, 15) + 4) as usize;
                    let tl = hlit + (bits(dat, pos + 5, 31) + 1) as usize;
                    pos += 14;
                    for i in 0..hclen {
                        clt[clim[i]] = bits(dat, pos + (i * 3) as usize, 7);
                    }
                    pos += hclen * 3;
                    for i in hclen..19 {
                        clt[clim[i]] = 0;
                    }
                    let clb = max(&clt);
                    let clbmsk = (1 << clb) - 1;
                    if !st.last && pos + tl * (clb + 7) as usize > tbts {
                        break;
                    }
                    hrmap(&clt, clb, &mut clmap, &mut le);
                    let mut i = 0;
                    loop {
                        let r = clmap[bits(dat, pos, clbmsk) as usize];
                        pos += (r & 15) as usize;
                        let s = (r >> 4) as u8;
                        if s < 16 {
                            ldt[i] = s;
                            i += 1;
                        } else {
                            let mut c = 0;
                            let mut n = 0;
                            if s == 16 {
                                n = 3 + bits(dat, pos, 3);
                                pos += 2;
                                c = ldt[i - 1];
                            }
                            else if s == 17 {
                                n = 3 + bits(dat, pos, 7);
                                pos += 3;
                            }
                            else if s == 18 {
                                n = 11 + bits(dat, pos, 127);
                                pos += 7;
                            }
                            let mut un = n as usize;
                            i += un;
                            while un > 0 {
                                ldt[i - un] = c;
                                un -= 1;
                            }
                        }
                        if i >= tl {
                            break;
                        }
                    }
                    let lt = &ldt[0..hlit];
                    let dt = &ldt[hlit..tl];
                    st.lbits = max(lt);
                    st.dbits = max(dt);
                    hrmap(lt, st.lbits, &mut st.lmap, &mut le);
                    hrmap(dt, st.dbits, &mut st.dmap, &mut le);
                }
                _ => {
                    return Err(InflateError::InvalidBlockType);
                }
            }
            if pos > tbts {
                return Err(InflateError::UnexpectedEOF);   
            }
        }
        st.head = false;
        let lms = (1u16 << st.lbits) - 1;
        let dms = (1u16 << st.dbits) - 1;
        let top = tbts - (st.lbits + st.dbits + 18) as usize;
        while st.last || pos < top {
            let c = st.lmap[
                bits16(dat, pos, lms) as usize
            ];
            pos += (c & 15) as usize;
            if c == 0 {
                return Err(InflateError::InvalidLengthOrLiteral);
            }
            let sym = c >> 4;
            if (sym & 256) == 0 {
                buf.write(sym as u8);
            } else if sym == 256 {
                st.head = true;
                break;
            } else {
                let mut add = sym - 254;
                if add > 10 {
                    let i = add as usize - 3;
                    let b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) as u16 + fl[i];
                    pos += b;
                }
                let d = st.dmap[
                    bits16(dat, pos, dms) as usize
                ];
                if d == 0 {
                    return Err(InflateError::InvalidDistance);
                }
                pos += (d & 15) as usize;
                let dsym = (d >> 4) as usize;
                let mut dt = fd[dsym] as usize;
                if dsym > 3 {
                    let b = fdeb[dsym];
                    dt += bits16(dat, pos, (1 << b) - 1) as usize;
                    pos += b;
                }
                if pos > tbts {
                    return Err(InflateError::UnexpectedEOF);
                }
                buf.copy_back(dt, add as usize);
            }
        }
        st.pos = pos;
        if !st.head || st.bfinal {
            break;
        }
    }
    Ok(())
}

pub fn inflate(dat: &[u8], out: &mut dyn OutputBuffer) -> Result<(), InflateError> {
    let mut st = InflateState::new();
    st.last = true;
    inflt(dat, out, &mut st)?;
    Ok(())
}