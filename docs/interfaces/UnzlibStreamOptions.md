# Interface: UnzlibStreamOptions

Options for decompressing a Zlib stream

## Hierarchy

- [`InflateStreamOptions`](InflateStreamOptions.md)

  ↳ **`UnzlibStreamOptions`**

## Table of contents

### Properties

- [dictionary](UnzlibStreamOptions.md#dictionary)

## Properties

### dictionary

• `Optional` **dictionary**: `Uint8Array`

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.

#### Inherited from

[InflateStreamOptions](InflateStreamOptions.md).[dictionary](InflateStreamOptions.md#dictionary)
