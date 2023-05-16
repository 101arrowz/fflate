# Interface: InflateStreamOptions

Options for decompressing a DEFLATE stream

## Hierarchy

* **InflateStreamOptions**

  ↳ [InflateOptions](inflateoptions.md)

  ↳ [GunzipStreamOptions](gunzipstreamoptions.md)

  ↳ [GunzipOptions](gunzipoptions.md)

  ↳ [UnzlibStreamOptions](unzlibstreamoptions.md)

  ↳ [AsyncInflateOptions](asyncinflateoptions.md)

  ↳ [AsyncGunzipOptions](asyncgunzipoptions.md)

## Index

### Properties

* [dictionary](inflatestreamoptions.md#dictionary)

## Properties

### dictionary

• `Optional` **dictionary**: Uint8Array

The dictionary used to compress the original data. If no dictionary was used during compression, this option has no effect.

Supplying the wrong dictionary during decompression usually yields corrupt output or causes an invalid distance error.
