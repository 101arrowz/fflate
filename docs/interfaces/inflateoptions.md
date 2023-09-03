# Interface: InflateOptions

Options for decompressing DEFLATE data

## Hierarchy

- [`InflateStreamOptions`](InflateStreamOptions.md)

  ↳ **`InflateOptions`**

  ↳↳ [`UnzlibOptions`](UnzlibOptions.md)

## Table of contents

### Properties

- [dictionary](InflateOptions.md#dictionary)
- [out](InflateOptions.md#out)

## Properties

### dictionary

• `Optional` **dictionary**: `Uint8Array`

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.

#### Inherited from

[InflateStreamOptions](InflateStreamOptions.md).[dictionary](InflateStreamOptions.md#dictionary)

___

### out

• `Optional` **out**: `Uint8Array`

The buffer into which to write the decompressed data. Saves memory if you know the decompressed size in advance.

Note that if the decompression result is larger than the size of this buffer, it will be truncated to fit.
