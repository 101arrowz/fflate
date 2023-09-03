# Interface: InflateStreamOptions

Options for decompressing a DEFLATE stream

## Hierarchy

- **`InflateStreamOptions`**

  ↳ [`InflateOptions`](InflateOptions.md)

  ↳ [`GunzipStreamOptions`](GunzipStreamOptions.md)

  ↳ [`GunzipOptions`](GunzipOptions.md)

  ↳ [`UnzlibStreamOptions`](UnzlibStreamOptions.md)

  ↳ [`AsyncInflateOptions`](AsyncInflateOptions.md)

  ↳ [`AsyncGunzipOptions`](AsyncGunzipOptions.md)

## Table of contents

### Properties

- [dictionary](InflateStreamOptions.md#dictionary)

## Properties

### dictionary

• `Optional` **dictionary**: `Uint8Array`

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.
