# Class: AsyncDecompress

Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression

## Hierarchy

* **AsyncDecompress**

## Index

### Constructors

* [constructor](asyncdecompress.md#constructor)

### Properties

* [ondata](asyncdecompress.md#ondata)

### Methods

* [push](asyncdecompress.md#push)

## Constructors

### constructor

\+ **new AsyncDecompress**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncDecompress](asyncdecompress.md)

Creates an asynchronous decompression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is decompressed  |

**Returns:** [AsyncDecompress](asyncdecompress.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be decompressed

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
