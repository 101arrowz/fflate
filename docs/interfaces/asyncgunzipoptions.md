# Interface: AsyncGunzipOptions

Options for decompressing GZIP data asynchronously

## Hierarchy

* AsyncOptions

* [InflateStreamOptions](inflatestreamoptions.md)

  ↳ **AsyncGunzipOptions**

## Index

### Properties

* [consume](asyncgunzipoptions.md#consume)
* [dictionary](asyncgunzipoptions.md#dictionary)

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
