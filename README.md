# fflate ![npm bundle size](https://img.shields.io/bundlephobia/min/fflate)
High performance (de)compression in an 8kB package

## Why fflate?
`fflate` (short for fast flate) is the **fastest, smallest, and most versatile** pure JavaScript compression and decompression library in existence, handily beating [`pako`](https://npmjs.com/package/pako), [`tiny-inflate`](https://npmjs.com/package/tiny-inflate), and [`UZIP.js`](https://github.com/photopea/UZIP.js) in performance benchmarks while being multiple times more lightweight. Its compression ratios are often better than even the original Zlib C library. It includes support for DEFLATE, GZIP, and Zlib data. Data compressed by `fflate` can be decompressed by other tools, and vice versa.

|                           | `pako` | `tiny-inflate`       | `UZIP.js`             | `fflate`                       |
|---------------------------|--------|----------------------|-----------------------|--------------------------------|
| Decompression performance | 1x     | Up to 40% slower     | **Up to 40% faster**  | **Up to 40% faster**           |
| Compression performance   | 1x     | N/A                  | Up to 5% faster       | **Up to 50% faster**           |
| Bundle size (minified)    | 45.6kB | **3kB**              | 14.2kB                | 8kB **(3kB for only inflate)** |
| Compression support       | ✅     | ❌                    | ✅                    | ✅                             |
| Thread/Worker safe        | ✅     | ✅                    | ❌                    | ✅                             |
| GZIP/Zlib support         | ✅     | ❌                    | ❌                    | ✅                             |
| Uses ES Modules           | ❌     | ❌                    | ❌                    | ✅                             |

## Usage

Install `fflate`:
```sh
npm i fflate 
# or yarn add fflate, or pnpm add fflate
```

Import:
```js
import * as fflate from 'fflate';
// ALWAYS import only what you need to minimize bundle size.
// So, if you just need GZIP compression support:
import { gzip } from 'fflate';
```
If your environment doesn't support ES Modules (e.g. Node.js):
```js
const fflate = require('fflate');
```

And use:
```js
// This is an ArrayBuffer of data
const massiveFileBuf = await fetch('/aMassiveFile').then(
  res => res.arrayBuffer()
);
// To use fflate, you need a Uint8Array
const massiveFile = new Uint8Array(massiveFileBuf);
// Note that Node.js Buffers work just fine as well:
// const massiveFile = require('fs').readFileSync('aMassiveFile.txt');

// Higher level means lower performance but better compression
// The level ranges from 0 (no compression) to 9 (max compression)
// The default level is 6
const notSoMassive = fflate.zlib(massiveFile, { level: 9 });
const massiveAgain = fflate.unzlib(notSoMassive);
```
`fflate` can autodetect a compressed file's format as well:
```js
const compressed = new Uint8Array(
  await fetch('/GZIPorZLIBorDEFLATE').then(res => res.arrayBuffer())
);
// Above example with Node.js Buffers:
// Buffer.from('H4sIAAAAAAAAE8tIzcnJBwCGphA2BQAAAA==', 'base64');

const decompressed = fflate.decompress(compressed);
```

Using strings is easy with `TextEncoder` and `TextDecoder`:
```js
const enc = new TextEncoder(), dec = new TextDecoder();
const buf = enc.encode('Hello world!');

// The default compression method is gzip
// Increasing mem may increase performance at the cost of memory
// The mem ranges from 0 to 12, where 4 is the default
const compressed = fflate.compress(buf, { level: 6, mem: 8 });

// When you need to decompress:
const decompressed = fflate.decompress(compressed);
const origText = dec.decode(decompressed);
console.log(origText); // Hello world!
```
Note that encoding the compressed data as a string, like in `pako`, is not nearly as efficient as binary for data transfer. However, you can do it:
```js
// data to string
const dts = data => {
  let result = '';
  for (let value of data) {
    result += String.fromCharCode(data);
  }
  return result;
}
// string to data
const std = str => {
  let result = new Uint8Array(str.length);
  for (let i = 0; i < str.length; ++i) {
    result[i] = str.charCodeAt(i);
  }
  return result.
}
const compressedString = dts(fflate.compress(buf));
const decompressed = fflate.decompress(std(compressedString));
```

See the [documentation](https://github.com/101arrowz/fflate/blob/master/docs/README.md) for more detailed information about the API.

## What makes `fflate` so fast?
Many JavaScript compression/decompression libraries exist. However, the most popular one, [`pako`](https://npmjs.com/package/pako), is merely a clone of Zlib rewritten nearly line-for-line in JavaScript. Although it is by no means poorly made, `pako` doesn't recognize the many differences between JavaScript and C, and therefore is suboptimal for performance. Moreover, even when minified, the library is 45 kB; it may not seem like much, but for anyone concerned with optimizing bundle size (especially library authors), it's more weight than necessary.

Note that there exist some small libraries like [`tiny-inflate`](https://npmjs.com/package/tiny-inflate) for solely decompression, and with a minified size of 3 kB, it can be appealing; however, its performance is lackluster, typically 40% worse than `pako` in my tests.

[`UZIP.js`](https://github.com/photopea/UZIP.js) is both faster (by up to 40%) and smaller (14 kB minified) than `pako`, and it contains a variety of innovations that make it excellent for both performance and compression ratio. However, the developer made a variety of tiny mistakes and inefficient design choices that make it imperfect. Moreover, it does not support GZIP or Zlib data directly; one must remove the headers manually to use `UZIP.js`.

So what makes `fflate` different? It takes the brilliant innovations of `UZIP.js` and optimizes them while adding direct support for GZIP and Zlib data. And unlike all of the above libraries, it uses ES Modules to allow for partial builds through tree shaking, meaning that it can rival even `tiny-inflate` in size while maintaining excellent performance. The end result is a library that, in total, weighs 8kB minified for the entire build (3kB for decompression only and 5kB for compression only), is about 15% faster than `UZIP.js` or up to 60% faster than `pako`, and achieves the same or better compression ratio than the rest.

Before you decide that `fflate` is the end-all compression library, you should note that JavaScript simply cannot rival the performance of a compiled language. If you're willing to have 160 kB of extra weight and [much less browser support](https://caniuse.com/wasm), you can achieve  more performance than `fflate` with a WASM build of Zlib like [`wasm-flate`](https://www.npmjs.com/package/wasm-flate). And if you're only using Node.js, just use the [native Zlib bindings](https://nodejs.org/api/zlib.html) that offer the best performance. Though note that even against these compiled libraries, `fflate` is only around 30% slower in decompression and 10% slower in compression, and can still achieve better compression ratios!

## Browser support
`fflate` makes heavy use of typed arrays (`Uint8Array`, `Uint16Array`, etc.). Typed arrays can be polyfilled at the cost of performance, but the most recent browser that doesn't support them [is from 2011](https://caniuse.com/typedarrays), so I wouldn't bother.

Other than that, `fflate` is completely ES3, meaning you probably won't even need a bundler to use it.

## Testing
You can validate the performance of `fflate` with `npm`/`yarn`/`pnpm` `test`. It validates that the module is working as expected, ensures the outputs are no more than 5% larger than competitors at max compression, and outputs performance metrics to `test/results`.

## License
MIT
