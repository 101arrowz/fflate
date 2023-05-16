# Interface: GunzipOptions

Options for decompressing GZIP data

## Hierarchy

* [InflateStreamOptions](inflatestreamoptions.md)

  ↳ **GunzipOptions**

## Index

### Properties

* [dictionary](gunzipoptions.md#dictionary)
* [out](gunzipoptions.md#out)

## Properties

### dictionary

• `Optional` **dictionary**: Uint8Array

*Inherited from [InflateStreamOptions](inflatestreamoptions.md).[dictionary](inflatestreamoptions.md#dictionary)*

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.

___

### out

• `Optional` **out**: Uint8Array

The buffer into which to write the decompressed data. GZIP already encodes the output size, so providing this doesn't save memory.
