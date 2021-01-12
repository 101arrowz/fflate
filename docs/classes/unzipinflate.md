# Class: UnzipInflate

Streaming DEFLATE decompression for ZIP archives. Prefer AsyncZipInflate for
better performance.

## Hierarchy

* **UnzipInflate**

## Implements

* [UnzipDecoder](../interfaces/unzipdecoder.md)

## Index

### Constructors

* [constructor](unzipinflate.md#constructor)

### Properties

* [ondata](unzipinflate.md#ondata)
* [compression](unzipinflate.md#compression)

### Methods

* [push](unzipinflate.md#push)

## Constructors

### constructor

\+ **new UnzipInflate**(): [UnzipInflate](unzipinflate.md)

Creates a DEFLATE decompression that can be used in ZIP archives

**Returns:** [UnzipInflate](unzipinflate.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

*Implementation of [UnzipDecoder](../interfaces/unzipdecoder.md).[ondata](../interfaces/unzipdecoder.md#ondata)*

___

### compression

▪ `Static` **compression**: number = 8

## Methods

### push

▸ **push**(`data`: Uint8Array, `final`: boolean): void

*Implementation of [UnzipDecoder](../interfaces/unzipdecoder.md)*

#### Parameters:

Name | Type |
------ | ------ |
`data` | Uint8Array |
`final` | boolean |

**Returns:** void
