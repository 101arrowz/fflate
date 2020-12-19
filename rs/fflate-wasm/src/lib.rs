use wasm_bindgen::prelude::*;
use fflate;

#[wasm_bindgen]
pub struct Inflate {
    buf: &'static Vec<u8>,
    inflator: fflate::Inflate<'static>
}

#[wasm_bindgen]
impl Inflate {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Inflate {
        unsafe {
            static mut buf: Vec<u8> = Vec::new();
            Inflate {
                buf: &buf,
                inflator: fflate::Inflate::new(&mut buf)
            }
        }
    }
    pub fn push(&mut self, dat: &[u8], last: bool) -> Result<> {
        self.inflator.write_all(dat);
    }
}