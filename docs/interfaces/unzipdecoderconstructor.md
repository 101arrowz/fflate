# Interface: UnzipDecoderConstructor

A constructor for a decoder for unzip streams

## Hierarchy

* **UnzipDecoderConstructor**

## Index

### Constructors

* [constructor](unzipdecoderconstructor.md#constructor)

### Properties

* [compression](unzipdecoderconstructor.md#compression)

## Constructors

### constructor

\+ **new UnzipDecoderConstructor**(`filename`: string, `size?`: number, `originalSize?`: number): [UnzipDecoder](unzipdecoder.md)

Creates an instance of the decoder

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`filename` | string | The name of the file |
`size?` | number | The compressed size of the file |
`originalSize?` | number | The original size of the file  |

**Returns:** [UnzipDecoder](unzipdecoder.md)

## Properties

### compression

•  **compression**: number

The compression format for the data stream. This number is determined by
the spec in PKZIP's APPNOTE.txt, section 4.4.5. For example, 0 = no
compression, 8 = deflate, 14 = LZMA
