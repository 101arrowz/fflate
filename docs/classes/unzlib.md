# Class: Unzlib

Streaming Zlib decompression

## Hierarchy

* **Unzlib**

## Index

### Constructors

* [constructor](unzlib.md#constructor)

### Properties

* [ondata](unzlib.md#ondata)

### Methods

* [push](unzlib.md#push)

## Constructors

### constructor

\+ **new Unzlib**(`cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Unzlib](unzlib.md)

Creates a Zlib decompression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is inflated  |

**Returns:** [Unzlib](unzlib.md)

## Properties

### ondata

•  **ondata**: [FlateStreamHandler](../README.md#flatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be unzlibbed

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
