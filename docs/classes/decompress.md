# Class: Decompress

Streaming GZIP, Zlib, or raw DEFLATE decompression

## Hierarchy

* **Decompress**

## Index

### Constructors

* [constructor](decompress.md#constructor)

### Properties

* [ondata](decompress.md#ondata)

### Methods

* [push](decompress.md#push)

## Constructors

### constructor

\+ **new Decompress**(`cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Decompress](decompress.md)

Creates a decompression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is decompressed  |

**Returns:** [Decompress](decompress.md)

## Properties

### ondata

•  **ondata**: [FlateStreamHandler](../README.md#flatestreamhandler)

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
