# Class: Zlib

Streaming Zlib compression

## Hierarchy

* **Zlib**

## Index

### Constructors

* [constructor](zlib.md#constructor)

### Properties

* [ondata](zlib.md#ondata)

### Methods

* [push](zlib.md#push)

## Constructors

### constructor

\+ **new Zlib**(`opts`: [ZlibOptions](../interfaces/zliboptions.md), `cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Zlib](zlib.md)

Creates a Zlib stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`opts` | [ZlibOptions](../interfaces/zliboptions.md) | The compression options |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [Zlib](zlib.md)

\+ **new Zlib**(`cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Zlib](zlib.md)

Creates a Zlib stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [Zlib](zlib.md)

## Properties

### ondata

•  **ondata**: [FlateStreamHandler](../README.md#flatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be zlibbed

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
