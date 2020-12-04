//! fflate - a fast, efficient, pure compression library
//!
//!

// Instead of trying to read this code, check out the TypeScript version

#![allow(non_upper_case_globals)]
#![no_std]

extern crate alloc;

use alloc::boxed::Box;
use alloc::vec::Vec;
use lazy_static::lazy_static;

macro_rules! BM {
    ($num:expr) => {
        (1 << $num) - 1
    };
}

const fleb: [u8; 32] = [
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

const fdeb: [u8; 32] = [
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13,
    13, 0, 0,
];

const fd: [u16; 32] = [
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537,
    2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0,
];

const fdt: [u8; 31] = [5u8; 31];

const clim: [u8; 19] = [
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
];

fn uvec<T>(sz: usize) -> Vec<T> {
    let mut v = Vec::with_capacity(sz);
    unsafe {
        v.set_len(sz);
    }
    v
}

fn freb(b: &[u16], r: &mut [u32]) {
    for i in 1..30 {
        let base = b[i];
        for j in base..b[i + 1] {
            r[j as usize] = ((j - base) << 5) as u32 | i as u32;
        }
    }
}

// hmap base
fn hmb(cd: &[u8], mb: u8) -> [u16; 16] {
    let mut l = [0u16; 16];
    for &cl in cd {
        l[cl as usize] += 1;
    }
    let mut le = [0u16; 16];
    let mut v = 0;
    for i in 1..mb {
        v += l[i as usize];
        le[i as usize] = v;
    }
    le
}

fn hmap(cd: &[u8], mb: u8) -> Box<[u16]> {
    let mut le = hmb(cd, mb);
    cd.iter()
        .map(|&cl| {
            let v = rev[le[cl as usize] as usize] >> (15 - cl);
            le[cl as usize] += 1;
            v
        })
        .collect::<Vec<_>>()
        .into_boxed_slice()
}

fn hrmap(cd: &[u8], mb: u8) -> Box<[u16]> {
    let mut le = hmb(cd, mb);
    let mut co = uvec(1 << mb).into_boxed_slice();
    let rvb = 15 - mb;
    for i in 0..cd.len() {
        let cl = cd[i];
        if cl != 0 {
            let sv = ((i as u16) << 4) | cl as u16;
            let r = mb - cl;
            let v = le[cl as usize] << r;
            le[cl as usize] += 1;
            let m = v + (1 << r);
            for j in v..m {
                co[rev[j as usize] as usize >> rvb] = sv;
            }
        }
    }
    co
}

lazy_static! {
    static ref revfl: Box<[u32]> = {
        let mut v = Vec::with_capacity(261).into_boxed_slice();
        freb(&fl, &mut v);
        v
    };
    static ref revfd: Box<[u32]> = {
        let mut v = Vec::with_capacity(32769).into_boxed_slice();
        freb(&fd, &mut v);
        v
    };
    static ref rev: Box<[u16]> = (0..32768)
        .map(|mut v| {
            v = ((v & 0xAAAA) >> 1) | ((v & 0x5555) << 1);
            v = ((v & 0xCCCC) >> 2) | ((v & 0x3333) << 2);
            v = ((v & 0xF0F0) >> 4) | ((v & 0x0F0F) << 4);
            (((v & 0xFF00) >> 8) | ((v & 0x00FF) << 8)) >> 1
        })
        .collect::<Vec<_>>()
        .into_boxed_slice();
    static ref flm: Box<[u16]> = hmap(&flt, 9);
    static ref flrm: Box<[u16]> = hrmap(&flt, 9);
    static ref fdm: Box<[u16]> = hmap(&fdt, 5);
    static ref fdrm: Box<[u16]> = hrmap(&flt, 5);
}

#[inline]
fn bits(dat: &[u8], pos: usize, mask: u8) -> u8 {
    let b = pos >> 3;
    return ((dat[b] as u16 | ((dat[b + 1] as u16) << 8)) >> (pos & 7)) as u8 & mask;
}

#[inline]
fn bits16(dat: &[u8], pos: usize, mask: u16) -> u16 {
    let b = pos >> 3;
    return ((dat[b] as u32 | ((dat[b + 1] as u32) << 8) | ((dat[b + 2] as u32) << 16)) >> (pos & 7))
        as u16
        & mask;
}

#[inline(always)]
fn shft(pos: usize) -> usize {
    pos >> 3 + (pos & 7 != 0) as usize
}

