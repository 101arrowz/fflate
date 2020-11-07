# Class: AsyncUnzlib

Asynchronous streaming Zlib decompression

## Hierarchy

* **AsyncUnzlib**

## Index

### Constructors

* [constructor](asyncunzlib.md#constructor)

### Properties

* [ondata](asyncunzlib.md#ondata)
* [terminate](asyncunzlib.md#terminate)

### Methods

* [push](asyncunzlib.md#push)

## Constructors

### constructor

\+ **new AsyncUnzlib**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncUnzlib](asyncunzlib.md)

Creates an asynchronous Zlib decompression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncUnzlib](asyncunzlib.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

___

### terminate

•  **terminate**: [AsyncTerminable](../interfaces/asyncterminable.md)

A method to terminate the stream's internal worker. Subsequent calls to
push() will silently fail.

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be decompressed from Zlib

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
