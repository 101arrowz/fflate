# Interface: UnzipOptions

Options for expanding a ZIP archive

## Hierarchy

- **`UnzipOptions`**

  ↳ [`AsyncUnzipOptions`](AsyncUnzipOptions.md)

## Table of contents

### Properties

- [decodeFilename](UnzipOptions.md#decodefilename)
- [filter](UnzipOptions.md#filter)

## Properties

### decodeFilename

• `Optional` **decodeFilename**: [`FilenameDecoder`](../README.md#filenamedecoder)

A custom decoder for filenames when UTF-8 flag is not set.
By default, Latin-1 (ISO-8859-1) encoding is used.
You can provide a custom decoder to handle other encodings like GBK, Shift-JIS, etc.

___

### filter

• `Optional` **filter**: [`UnzipFileFilter`](../README.md#unzipfilefilter)

A filter function to extract only certain files from a ZIP archive
