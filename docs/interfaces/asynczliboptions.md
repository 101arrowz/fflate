# Interface: AsyncZlibOptions

Options for compressing data asynchronously into a Zlib format

## Hierarchy

* [ZlibOptions](zliboptions.md)

* AsyncOptions

  ↳ **AsyncZlibOptions**

## Index

### Properties

* [consume](asynczliboptions.md#consume)
* [level](asynczliboptions.md#level)
* [mem](asynczliboptions.md#mem)

## Properties

### consume

• `Optional` **consume**: boolean

*Inherited from [AsyncDeflateOptions](asyncdeflateoptions.md).[consume](asyncdeflateoptions.md#consume)*

Whether or not to "consume" the source data. This will make the typed array/buffer you pass in
unusable but will increase performance and reduce memory usage.

___

### level

• `Optional` **level**: 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9

*Inherited from [DeflateOptions](deflateoptions.md).[level](deflateoptions.md#level)*

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

• `Optional` **mem**: 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12

*Inherited from [DeflateOptions](deflateoptions.md).[mem](deflateoptions.md#mem)*

The memory level to use, ranging from 0-12. Increasing this increases speed and compression ratio at the cost of memory.

Note that this is exponential: while level 0 uses 4 kB, level 4 uses 64 kB, level 8 uses 1 MB, and level 12 uses 16 MB.
It is recommended not to lower the value below 4, since that tends to hurt performance.
In addition, values above 8 tend to help very little on most data and can even hurt performance.

The default value is automatically determined based on the size of the input data.
