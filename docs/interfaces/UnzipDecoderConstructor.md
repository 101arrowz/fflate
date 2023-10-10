# Interface: UnzipDecoderConstructor

A constructor for a decoder for unzip streams

## Table of contents

### Constructors

- [constructor](UnzipDecoderConstructor.md#constructor)

### Properties

- [compression](UnzipDecoderConstructor.md#compression)

## Constructors

### constructor

• **new UnzipDecoderConstructor**(`filename`, `size?`, `originalSize?`)

Creates an instance of the decoder

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | The name of the file |
| `size?` | `number` | The compressed size of the file |
| `originalSize?` | `number` | The original size of the file |

## Properties

### compression

• **compression**: `number`

The compression format for the data stream. This number is determined by
the spec in PKZIP's APPNOTE.txt, section 4.4.5. For example, 0 = no
compression, 8 = deflate, 14 = LZMA
