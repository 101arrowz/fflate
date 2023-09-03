# Interface: UnzlibOptions

Options for decompressing Zlib data

## Hierarchy

* [InflateOptions](inflateoptions.md)

  ↳ **UnzlibOptions**

## Index

### Properties

* [dictionary](unzliboptions.md#dictionary)
* [out](unzliboptions.md#out)

## Properties

### dictionary

• `Optional` **dictionary**: Uint8Array

*Inherited from [InflateStreamOptions](inflatestreamoptions.md).[dictionary](inflatestreamoptions.md#dictionary)*

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.

___

### out

• `Optional` **out**: Uint8Array

*Inherited from [InflateOptions](inflateoptions.md).[out](inflateoptions.md#out)*

The buffer into which to write the decompressed data. Saves memory if you know the decompressed size in advance.

Note that if the decompression result is larger than the size of this buffer, it will be truncated to fit.
