use wasm_bindgen::prelude::*;
use fflate;

#[wasm_bindgen]
pub fn inflate(dat: &[u8]) -> Vec<u8> {
    let mut v = Vec::new();
    fflate::inflate(dat, &mut v);
    v
}

// use std::io::prelude::*;
// use std::env;
// use std::fs::read;
// use std::time;
// use flate2::Compression;
// use flate2::write::DeflateEncoder;
// use flate2::write::DeflateDecoder;
// use libflate::deflate::Decoder;
// mod lib;



// fn main() {
//     let args: Vec<String> = env::args().collect();
//     let buf = read(&args[1]).unwrap();
//     let mut e = DeflateEncoder::new(Vec::new(), Compression::default());
//     e.write_all(&buf).unwrap();
//     let cmpr = e.finish().unwrap();
//     let t = time::Instant::now();
//     let mut infld = Vec::new();
//     let decmpr = lib::inflate(&cmpr, &mut infld);
//     println!("fflate time: {:?}", t.elapsed());
//     let t2 = time::Instant::now();
//     let mut dec = DeflateDecoder::new(Vec::new());
//     dec.write_all(&cmpr).unwrap();
//     let decmpr2 = dec.finish().unwrap();
//     println!("flate2 time: {:?}", t2.elapsed());
//     let t3 = time::Instant::now();
//     let mut dec = Decoder::new(&*cmpr);
//     let mut decmpr3 = Vec::new();
//     dec.read_to_end(&mut decmpr3).unwrap();
//     println!("libflate time: {:?}", t3.elapsed());
// }