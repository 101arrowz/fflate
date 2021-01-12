# Class: UnzipPassThrough

Streaming pass-through decompression for ZIP archives

## Hierarchy

* **UnzipPassThrough**

## Implements

* [UnzipDecoder](../interfaces/unzipdecoder.md)

## Index

### Properties

* [ondata](unzippassthrough.md#ondata)
* [compression](unzippassthrough.md#compression)

### Methods

* [push](unzippassthrough.md#push)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

*Implementation of [UnzipDecoder](../interfaces/unzipdecoder.md).[ondata](../interfaces/unzipdecoder.md#ondata)*

___

### compression

▪ `Static` **compression**: number = 0

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
