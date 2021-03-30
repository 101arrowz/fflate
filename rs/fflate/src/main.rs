use std::fs;
use std::env;
use std::time;
use std::string;
extern crate miniz_oxide;
mod lib;


fn main() {
    let args = env::args().collect::<Vec<String>>();
    let fp = args.get(1).unwrap();
    let dat = fs::read(fp).unwrap();
    let mut out = Vec::new();
    let ts = time::Instant::now();
    lib::inflate(&dat, &mut out);
    println!("{:?} {}", ts.elapsed(), out.len());
    let ts = time::Instant::now();
    let o2 = miniz_oxide::inflate::decompress_to_vec(&dat).unwrap();
    println!("{:?}", ts.elapsed());
}