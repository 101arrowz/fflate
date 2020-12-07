use std::fs::{File};
use std::io::Read;
use std::vec::Vec;
use std::time::Instant;
use std::env::args;
// use flate2::bufread::DeflateDecoder;
mod lib;

fn main() {
    let args: Vec<String> = args().collect();
    // Assumes run in root dir - good enough for a test
    let fp_base = String::from("../test/data/largeImage");
    let fp = &args.get(1).unwrap_or(&fp_base);
    let mut f = File::open(fp).unwrap();
    let mut v: Vec<u8> = Vec::new();
    if f.read_to_end(&mut v).is_ok() {
        for _ in 0..5 {
            let now = Instant::now();
            let out = lib::inflate(&v);
            let el = now.elapsed();
            println!("{}.{:06}s {:?}", el.as_secs(), el.as_nanos() / 1000, out.unwrap().len());
        }
        // for _ in 0..5 {
        //     let now = Instant::now();
        //     let mut out = Vec::new();
        //     let mut strm = DeflateDecoder::new(&v[..]);
        //     if let Err(e) = strm.read_to_end(&mut out) {
        //         panic!(e);
        //     }
        //     let el = now.elapsed();
        //     println!("flate2: {}.{:06}s {:?}", el.as_secs(), el.as_nanos() / 1000, out.len());
        // }
    }
}