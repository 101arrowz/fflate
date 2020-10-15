# Class: Gzip

Streaming GZIP compression
Streaming GZIP compression

## Hierarchy

* **Gzip**

## Index

### Constructors

* [constructor](gzip.md#constructor)

### Properties

* [ondata](gzip.md#ondata)

### Methods

* [push](gzip.md#push)

## Constructors

### constructor

\+ **new Gzip**(`opts`: [GzipOptions](../interfaces/gzipoptions.md), `cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Gzip](gzip.md)

Creates a GZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`opts` | [GzipOptions](../interfaces/gzipoptions.md) | The compression options |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [Gzip](gzip.md)

\+ **new Gzip**(`cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Gzip](gzip.md)

Creates a GZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [Gzip](gzip.md)

\+ **new Gzip**(`opts`: [GzipOptions](../interfaces/gzipoptions.md), `cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Gzip](gzip.md)

Creates a GZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`opts` | [GzipOptions](../interfaces/gzipoptions.md) | The compression options |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [Gzip](gzip.md)

\+ **new Gzip**(`cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Gzip](gzip.md)

Creates a GZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [Gzip](gzip.md)

## Properties

### ondata

•  **ondata**: [FlateStreamHandler](../README.md#flatestreamhandler)

The handler to call whenever data is available
The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be GZIPped

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
