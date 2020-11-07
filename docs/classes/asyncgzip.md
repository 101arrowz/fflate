# Class: AsyncGzip

Asynchronous streaming GZIP compression
Asynchronous streaming GZIP compression

## Hierarchy

* **AsyncGzip**

## Index

### Constructors

* [constructor](asyncgzip.md#constructor)

### Properties

* [ondata](asyncgzip.md#ondata)
* [terminate](asyncgzip.md#terminate)

### Methods

* [push](asyncgzip.md#push)

## Constructors

### constructor

\+ **new AsyncGzip**(`opts`: [GzipOptions](../interfaces/gzipoptions.md), `cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGzip](asyncgzip.md)

Creates an asynchronous GZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`opts` | [GzipOptions](../interfaces/gzipoptions.md) | The compression options |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncGzip](asyncgzip.md)

\+ **new AsyncGzip**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGzip](asyncgzip.md)

Creates an asynchronous GZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncGzip](asyncgzip.md)

\+ **new AsyncGzip**(`opts`: [GzipOptions](../interfaces/gzipoptions.md), `cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGzip](asyncgzip.md)

Creates an asynchronous GZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`opts` | [GzipOptions](../interfaces/gzipoptions.md) | The compression options |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncGzip](asyncgzip.md)

\+ **new AsyncGzip**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGzip](asyncgzip.md)

Creates an asynchronous GZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncGzip](asyncgzip.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available
The handler to call whenever data is available

___

### terminate

•  **terminate**: [AsyncTerminable](../interfaces/asyncterminable.md)

A method to terminate the stream's internal worker. Subsequent calls to
push() will silently fail.
A method to terminate the stream's internal worker. Subsequent calls to
push() will silently fail.

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

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be GZIPped

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
