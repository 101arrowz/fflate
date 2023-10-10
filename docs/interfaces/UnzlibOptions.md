# Interface: UnzlibOptions

Options for decompressing Zlib data

## Hierarchy

- [`InflateOptions`](InflateOptions.md)

  ↳ **`UnzlibOptions`**

## Table of contents

### Properties

- [dictionary](UnzlibOptions.md#dictionary)
- [out](UnzlibOptions.md#out)

## Properties

### dictionary

• `Optional` **dictionary**: `Uint8Array`

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.

#### Inherited from

[InflateOptions](InflateOptions.md).[dictionary](InflateOptions.md#dictionary)

___

### out

• `Optional` **out**: `Uint8Array`

The buffer into which to write the decompressed data. Saves memory if you know the decompressed size in advance.

Note that if the decompression result is larger than the size of this buffer, it will be truncated to fit.

#### Inherited from

[InflateOptions](InflateOptions.md).[out](InflateOptions.md#out)
