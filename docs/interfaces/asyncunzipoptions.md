# Interface: AsyncUnzipOptions

Options for asynchronously expanding a ZIP archive

## Hierarchy

* AsyncOptions

  ↳ **AsyncUnzipOptions**

## Index

### Properties

* [consume](asyncunzipoptions.md#consume)

## Properties

### consume

• `Optional` **consume**: boolean

*Inherited from [AsyncDeflateOptions](asyncdeflateoptions.md).[consume](asyncdeflateoptions.md#consume)*

Whether or not to "consume" the source data. This will make the typed array/buffer you pass in
unusable but will increase performance and reduce memory usage.
