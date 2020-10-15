# Class: Deflate

Streaming DEFLATE compression

## Hierarchy

* **Deflate**

## Index

### Constructors

* [constructor](deflate.md#constructor)

### Properties

* [ondata](deflate.md#ondata)

### Methods

* [push](deflate.md#push)

## Constructors

### constructor

\+ **new Deflate**(`opts`: [DeflateOptions](../interfaces/deflateoptions.md), `cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Deflate](deflate.md)

Creates a DEFLATE stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`opts` | [DeflateOptions](../interfaces/deflateoptions.md) | The compression options |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [Deflate](deflate.md)

\+ **new Deflate**(`cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Deflate](deflate.md)

Creates a DEFLATE stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [Deflate](deflate.md)

## Properties

### ondata

•  **ondata**: [FlateStreamHandler](../README.md#flatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be deflated

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
