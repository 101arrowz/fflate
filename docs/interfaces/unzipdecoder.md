# Interface: UnzipDecoder

A decoder for files in ZIP streams

## Hierarchy

* **UnzipDecoder**

## Implemented by

* [AsyncUnzipInflate](../classes/asyncunzipinflate.md)
* [UnzipInflate](../classes/unzipinflate.md)
* [UnzipPassThrough](../classes/unzippassthrough.md)

## Index

### Properties

* [ondata](unzipdecoder.md#ondata)
* [terminate](unzipdecoder.md#terminate)

### Methods

* [push](unzipdecoder.md#push)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

___

### terminate

• `Optional` **terminate**: [AsyncTerminable](asyncterminable.md)

A method to terminate any internal workers used by the stream. Subsequent
calls to push() should silently fail.

## Methods

### push

▸ **push**(`data`: Uint8Array, `final`: boolean): void

Pushes a chunk to be decompressed

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data in this chunk. Do not consume (detach) this data. |
`final` | boolean | Whether this is the last chunk in the data stream  |

**Returns:** void
