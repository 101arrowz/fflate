//! fflate - a fast, efficient, pure compression library
//!
//!

// Instead of trying to read this code, check out the TypeScript version

#![allow(non_upper_case_globals)]
#![cfg_attr(not(feature = "std"), no_std)]
use lazy_static::lazy_static;

#[cfg(feature = "std")]
use std::{vec::Vec, io::{Read, Write, Error, ErrorKind}};

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
    for i in 1..t {
        le[i] = 0;
    }
    for &cl in cd {
        le[cl as usize] += 1;
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
        // TODO: remove cond
        if cl != 0 {
            let r = mbu - cl;
            let v = (le[cl] << r) as usize;
            let m = v + (1 << r);
            let sv = if cl != 0 {
                le[cl] += 1;
                ((i as u16) << 4) | cl as u16
            } else {
                0
            };
            for j in v..m {
                co[rev[j] >> rvb] = sv;
            }
        }
    }
}

lazy_static! {
    static ref revfl: [u32; 261]= {
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
fn byte(dat: &[u8], bpos: usize) -> u8 {
   if bpos < dat.len() {
       dat[bpos]
   } else {
       0
   }
}

#[inline]
fn bits(dat: &[u8], pos: usize, mask: u8) -> u8 {
    let b = pos >> 3;
    ((byte(dat, b) as u16 | ((byte(dat, b + 1) as u16) << 8)) >> (pos & 7)) as u8 & mask
}

#[inline]
fn bits16(dat: &[u8], pos: usize, mask: u16) -> u16 {
    let b = pos >> 3;
    ((byte(dat, b) as u32
        | ((byte(dat, b + 1) as u32) << 8)
        | ((byte(dat, b + 2) as u32) << 16))
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
    clmap: [u16; 128],
    le: [u16; 16],
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
            clmap: [0; 128],
            le: [0; 16],
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

#[cfg(feature = "std")]
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

pub trait OutputBuffer {
    fn w(&mut self, value: u8);
    fn wall(&mut self, slice: &[u8]) {
        for &value in slice {
            self.w(value);
        }
    }
    fn palloc(&mut self, extra_bytes: usize);
    fn back(&self, back: usize) -> u8;
}

#[cfg(feature = "std")]
impl OutputBuffer for Vec<u8> {
    #[inline(always)]
    fn w(&mut self, value: u8) {
        self.push(value);
    }
    #[inline(always)]
    fn wall(&mut self, slice: &[u8]) {
        self.extend(slice.iter());
    }
    #[inline(always)]
    fn palloc(&mut self, extra_bytes: usize) {
        self.reserve(extra_bytes);
    }
    #[inline(always)]
    fn back(&self, back: usize) -> u8 {
        self[self.len() - back]
    }
}

pub struct SliceOutputBuffer<'a > {
    buf: &'a mut [u8],
    byte: usize
}

impl<'a> SliceOutputBuffer<'a> {
    #[inline(always)]
    pub fn new(slice: &'a mut [u8]) -> SliceOutputBuffer<'a> {
        SliceOutputBuffer {
            buf: slice,
            byte: 0
        }
    }
}

impl<'a> OutputBuffer for SliceOutputBuffer<'a> {
    #[inline(always)]
    fn w(&mut self, value: u8) {
        if self.byte < self.buf.len() {
            self.buf[self.byte] = value;
        }
        self.byte += 1;
    }
    #[inline(always)]
    fn wall(&mut self, slice: &[u8]) {
        let sl = slice.len();
        let end = self.byte + sl;
        if end <= self.buf.len() {
            self.buf[self.byte..end].copy_from_slice(slice);
        }
        self.byte = end;
    }
    #[inline(always)]
    fn palloc(&mut self, _eb: usize) {}
    #[inline(always)]
    fn back(&self, back: usize) -> u8 {
        self.buf[self.byte - back]
    }
}

fn inflt(dat: &[u8], buf: &mut dyn OutputBuffer, st: &mut InflateState) -> Result<(), InflateError> {
    let mut pos = st.pos;
    let sl = dat.len();
    if st.bfinal && st.head { return Ok(()) };
    let tbts = sl << 3;
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
                    let l = dat[s - 4] as u16 | ((dat[s - 3] as u16) << 8);
                    let t = s + l as usize;
                    if t > dat.len() {
                        if st.last {
                            return Err(InflateError::UnexpectedEOF);
                        }
                        break;
                    }
                    buf.wall(&dat[s..t]);
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
                    let clb = *clt.iter().max().unwrap();
                    let clbmsk = (1 << clb) - 1;
                    if !st.last && pos + tl * (clb + 7) as usize > tbts {
                        break;
                    }
                    hrmap(&clt, clb, &mut st.clmap, &mut st.le);
                    let mut i = 0;
                    loop {
                        let r = st.clmap[bits(dat, pos, clbmsk) as usize];
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
                    st.lbits = *lt.iter().max().unwrap();
                    st.dbits = *dt.iter().max().unwrap();
                    hrmap(lt, st.lbits, &mut st.lmap, &mut st.le);
                    hrmap(dt, st.dbits, &mut st.dmap, &mut st.le);
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
        let lms = (1 << st.lbits) - 1;
        let dms = (1 << st.dbits) - 1;
        let mxa = (st.lbits + st.dbits + 18) as usize;
        while st.last || pos + mxa < tbts {
            let c = st.lmap[bits16(dat, pos, lms) as usize];
            pos += (c & 15) as usize;
            if pos > tbts {
                return Err(InflateError::UnexpectedEOF);
            }
            if c == 0 {
                return Err(InflateError::InvalidLengthOrLiteral);
            }
            let sym = c >> 4;
            if (sym >> 8) == 0 {
                buf.w(sym as u8);
            } else if sym == 256 {
                st.head = true;
                break;
            } else {
                let mut add = sym - 254;
                if add > 10 {
                    let i = (add as usize) - 3;
                    let b = fleb[i];
                    add = bits(dat, pos, (1 << b) - 1) as u16 + fl[i as usize];
                    pos += b;
                }
                let d = st.dmap[bits16(dat, pos, dms) as usize];
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
                while add != 0 {
                    buf.w(buf.back(dt));
                    add -= 1;
                }
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
    out.palloc(dat.len() * 3);
    let mut st = InflateState::new();
    st.last = true;
    inflt(dat, out, &mut st)?;
    Ok(())
}

pub struct Inflate<'a> {
    pub sink: &'a mut dyn OutputBuffer,
    state: InflateState
}

impl<'a> Inflate<'a> {
    pub fn push(&mut self, data: &[u8]) -> Result<usize, InflateError> {
        inflt(data, self.sink, &mut self.state)?;
        let bytes = self.state.pos >> 3;
        self.state.pos &= 7;
        Ok(bytes)
    }
    pub fn end(&mut self) -> Result<(), InflateError> {
        self.state.last = true;
        self.push(&et)?;
        Ok(())
    }
    pub fn new(sink: &'a mut dyn OutputBuffer) -> Inflate<'a> {
        Inflate {
            state: InflateState::new(),
            sink: sink
        }
    }
}

#[cfg(feature = "std")]
impl<'a> Write for Inflate<'a> {
    #[inline(always)]
    fn write(&mut self, data: &[u8]) -> Result<usize, Error> {
        Ok(self.push(data)?)
    }
    #[inline(always)]
    fn flush(&mut self) -> Result<(), Error> {
        Ok(self.end()?)
    }
}