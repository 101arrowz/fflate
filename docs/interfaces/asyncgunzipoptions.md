# Interface: AsyncGunzipOptions

Options for decompressing GZIP data asynchronously

## Hierarchy

- `AsyncOptions`

- [`InflateStreamOptions`](InflateStreamOptions.md)

  ↳ **`AsyncGunzipOptions`**

## Table of contents

### Properties

- [consume](AsyncGunzipOptions.md#consume)
- [dictionary](AsyncGunzipOptions.md#dictionary)

## Properties

### consume

• `Optional` **consume**: `boolean`

Whether or not to "consume" the source data. This will make the typed array/buffer you pass in
unusable but will increase performance and reduce memory usage.

#### Inherited from

AsyncOptions.consume

___

### dictionary

• `Optional` **dictionary**: `Uint8Array`

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.

#### Inherited from

[InflateStreamOptions](InflateStreamOptions.md).[dictionary](InflateStreamOptions.md#dictionary)
