# Interface: InflateOptions

Options for decompressing DEFLATE data

## Hierarchy

* [InflateStreamOptions](inflatestreamoptions.md)

  ↳ **InflateOptions**

  ↳↳ [UnzlibOptions](unzliboptions.md)

## Index

### Properties

* [dictionary](inflateoptions.md#dictionary)
* [out](inflateoptions.md#out)

## Properties

### dictionary

• `Optional` **dictionary**: Uint8Array

*Inherited from [InflateStreamOptions](inflatestreamoptions.md).[dictionary](inflatestreamoptions.md#dictionary)*

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.

___

### out

• `Optional` **out**: Uint8Array

The buffer into which to write the decompressed data. Saves memory if you know the decompressed size in advance.
