use wasm_bindgen::prelude::*;
use fflate::{inflate, InflateError};

#[wasm_bindgen]
pub fn inflate_raw(buf: &[u8]) -> Result<Vec<u8>, JsValue> {
    let mut out = Vec::new();
    if let Err(e) = inflate(buf, &mut out) {
        return Err(JsValue::from(match e {
            InflateError::InvalidBlockType => "invalid block type",
            InflateError::InvalidDistance => "invalid distance",
            InflateError::InvalidLengthOrLiteral => "invalid length/literal",
            InflateError::UnexpectedEOF => "unexpected EOF"
        }));
    }
    Ok(out)
}