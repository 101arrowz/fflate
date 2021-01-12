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

\+ **new UnzipDecoderConstructor**(): [UnzipDecoder](unzipdecoder.md)

Creates an instance of the decoder

**Returns:** [UnzipDecoder](unzipdecoder.md)

## Properties

### compression

•  **compression**: number

The compression format for the data stream. This number is determined by
the spec in PKZIP's APPNOTE.txt, section 4.4.5. For example, 0 = no
compression, 8 = deflate, 14 = LZMA
