# Interface: AsyncUnzipOptions

Options for asynchronously expanding a ZIP archive

## Hierarchy

- [`UnzipOptions`](UnzipOptions.md)

  ↳ **`AsyncUnzipOptions`**

## Table of contents

### Properties

- [decodeFilename](AsyncUnzipOptions.md#decodefilename)
- [filter](AsyncUnzipOptions.md#filter)

## Properties

### decodeFilename

• `Optional` **decodeFilename**: [`FilenameDecoder`](../README.md#filenamedecoder)

A custom decoder for filenames when UTF-8 flag is not set.
By default, Latin-1 (ISO-8859-1) encoding is used.
You can provide a custom decoder to handle other encodings like GBK, Shift-JIS, etc.

#### Inherited from

[UnzipOptions](UnzipOptions.md).[decodeFilename](UnzipOptions.md#decodefilename)

___

### filter

• `Optional` **filter**: [`UnzipFileFilter`](../README.md#unzipfilefilter)

A filter function to extract only certain files from a ZIP archive

#### Inherited from

[UnzipOptions](UnzipOptions.md).[filter](UnzipOptions.md#filter)
