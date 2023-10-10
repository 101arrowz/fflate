# Interface: AsyncInflateOptions

Options for decompressing DEFLATE data asynchronously

## Hierarchy

- `AsyncOptions`

- [`InflateStreamOptions`](InflateStreamOptions.md)

  ↳ **`AsyncInflateOptions`**

  ↳↳ [`AsyncUnzlibOptions`](AsyncUnzlibOptions.md)

## Table of contents

### Properties

- [consume](AsyncInflateOptions.md#consume)
- [dictionary](AsyncInflateOptions.md#dictionary)
- [size](AsyncInflateOptions.md#size)

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

___

### size

• `Optional` **size**: `number`

The original size of the data. Currently, the asynchronous API disallows
writing into a buffer you provide; the best you can do is provide the
size in bytes and be given back a new typed array.
