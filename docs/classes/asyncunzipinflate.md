# Class: AsyncUnzipInflate

Asynchronous streaming DEFLATE decompression for ZIP archives

## Hierarchy

* **AsyncUnzipInflate**

## Implements

* [UnzipDecoder](../interfaces/unzipdecoder.md)

## Index

### Constructors

* [constructor](asyncunzipinflate.md#constructor)

### Properties

* [ondata](asyncunzipinflate.md#ondata)
* [terminate](asyncunzipinflate.md#terminate)
* [compression](asyncunzipinflate.md#compression)

### Methods

* [push](asyncunzipinflate.md#push)

## Constructors

### constructor

\+ **new AsyncUnzipInflate**(`_`: string, `sz`: number): [AsyncUnzipInflate](asyncunzipinflate.md)

Creates a DEFLATE decompression that can be used in ZIP archives

#### Parameters:

Name | Type |
------ | ------ |
`_` | string |
`sz` | number |

**Returns:** [AsyncUnzipInflate](asyncunzipinflate.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

*Implementation of [UnzipDecoder](../interfaces/unzipdecoder.md).[ondata](../interfaces/unzipdecoder.md#ondata)*

___

### terminate

•  **terminate**: [AsyncTerminable](../interfaces/asyncterminable.md)

*Implementation of [UnzipDecoder](../interfaces/unzipdecoder.md).[terminate](../interfaces/unzipdecoder.md#terminate)*

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
