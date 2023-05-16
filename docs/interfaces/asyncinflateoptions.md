# Interface: AsyncInflateOptions

Options for decompressing DEFLATE data asynchronously

## Hierarchy

* AsyncOptions

* [InflateStreamOptions](inflatestreamoptions.md)

  ↳ **AsyncInflateOptions**

  ↳↳ [AsyncUnzlibOptions](asyncunzliboptions.md)

## Index

### Properties

* [consume](asyncinflateoptions.md#consume)
* [dictionary](asyncinflateoptions.md#dictionary)
* [size](asyncinflateoptions.md#size)

## Properties

### consume

• `Optional` **consume**: boolean

*Inherited from [AsyncDeflateOptions](asyncdeflateoptions.md).[consume](asyncdeflateoptions.md#consume)*

Whether or not to "consume" the source data. This will make the typed array/buffer you pass in
unusable but will increase performance and reduce memory usage.

___

### dictionary

• `Optional` **dictionary**: Uint8Array

*Inherited from [InflateStreamOptions](inflatestreamoptions.md).[dictionary](inflatestreamoptions.md#dictionary)*

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.

___

### size

• `Optional` **size**: number

The original size of the data. Currently, the asynchronous API disallows
writing into a buffer you provide; the best you can do is provide the
size in bytes and be given back a new typed array.
