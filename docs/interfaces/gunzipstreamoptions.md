# Interface: GunzipStreamOptions

Options for decompressing a GZIP stream

## Hierarchy

* [InflateStreamOptions](inflatestreamoptions.md)

  ↳ **GunzipStreamOptions**

## Index

### Properties

* [dictionary](gunzipstreamoptions.md#dictionary)

## Properties

### dictionary

• `Optional` **dictionary**: Uint8Array

*Inherited from [InflateStreamOptions](inflatestreamoptions.md).[dictionary](inflatestreamoptions.md#dictionary)*

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.
