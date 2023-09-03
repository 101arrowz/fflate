# Interface: DeflateOptions

Options for compressing data into a DEFLATE format

## Hierarchy

- **`DeflateOptions`**

  ↳ [`GzipOptions`](GzipOptions.md)

  ↳ [`ZlibOptions`](ZlibOptions.md)

  ↳ [`AsyncDeflateOptions`](AsyncDeflateOptions.md)

  ↳ [`ZipOptions`](ZipOptions.md)

## Table of contents

### Properties

- [dictionary](DeflateOptions.md#dictionary)
- [level](DeflateOptions.md#level)
- [mem](DeflateOptions.md#mem)

## Properties

### dictionary

• `Optional` **dictionary**: `Uint8Array`

A buffer containing common byte sequences in the input data that can be used to significantly improve compression ratios.

Dictionaries should be 32kB or smaller and include strings or byte sequences likely to appear in the input.
The decompressor must supply the same dictionary as the compressor to extract the original data.

Dictionaries only improve aggregate compression ratio when reused across multiple small inputs. They should typically not be used otherwise.

Avoid using dictionaries with GZIP and ZIP to maximize software compatibility.

___

### level

• `Optional` **level**: ``0`` \| ``2`` \| ``1`` \| ``3`` \| ``4`` \| ``8`` \| ``5`` \| ``6`` \| ``7`` \| ``9``

The level of compression to use, ranging from 0-9.

0 will store the data without compression.
1 is fastest but compresses the worst, 9 is slowest but compresses the best.
The default level is 6.

Typically, binary data benefits much more from higher values than text data.
In both cases, higher values usually take disproportionately longer than the reduction in final size that results.

For example, a 1 MB text file could:
- become 1.01 MB with level 0 in 1ms
- become 400 kB with level 1 in 10ms
- become 320 kB with level 9 in 100ms

___

### mem

• `Optional` **mem**: ``0`` \| ``2`` \| ``1`` \| ``3`` \| ``4`` \| ``8`` \| ``5`` \| ``6`` \| ``10`` \| ``7`` \| ``12`` \| ``9`` \| ``11``

The memory level to use, ranging from 0-12. Increasing this increases speed and compression ratio at the cost of memory.

Note that this is exponential: while level 0 uses 4 kB, level 4 uses 64 kB, level 8 uses 1 MB, and level 12 uses 16 MB.
It is recommended not to lower the value below 4, since that tends to hurt performance.
In addition, values above 8 tend to help very little on most data and can even hurt performance.

The default value is automatically determined based on the size of the input data.
