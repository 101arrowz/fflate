# Class: AsyncGzip

Asynchronous streaming DEFLATE compression
Asynchronous streaming DEFLATE compression

## Hierarchy

* AsyncCmpStrm\<[GzipOptions](../interfaces/gzipoptions.md)>

* AsyncCmpStrm\<[GzipOptions](../interfaces/gzipoptions.md)>

  ↳ **AsyncGzip**

## Index

### Constructors

* [constructor](asyncgzip.md#constructor)

### Properties

* [ondata](asyncgzip.md#ondata)

### Methods

* [push](asyncgzip.md#push)

## Constructors

### constructor

\+ **new AsyncGzip**(`opts`: [GzipOptions](../interfaces/gzipoptions.md), `cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGzip](asyncgzip.md)

*Inherited from [AsyncDeflate](asyncdeflate.md).[constructor](asyncdeflate.md#constructor)*

*Overrides [AsyncInflate](asyncinflate.md).[constructor](asyncinflate.md#constructor)*

Creates an asynchronous compression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`opts` | [GzipOptions](../interfaces/gzipoptions.md) | The compression options |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncGzip](asyncgzip.md)

\+ **new AsyncGzip**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGzip](asyncgzip.md)

*Inherited from [AsyncDeflate](asyncdeflate.md).[constructor](asyncdeflate.md#constructor)*

*Overrides [AsyncInflate](asyncinflate.md).[constructor](asyncinflate.md#constructor)*

Creates an asynchronous compression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncGzip](asyncgzip.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

*Inherited from [AsyncDeflate](asyncdeflate.md).[ondata](asyncdeflate.md#ondata)*

*Overrides [AsyncDeflate](asyncdeflate.md).[ondata](asyncdeflate.md#ondata)*

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

*Inherited from [AsyncDeflate](asyncdeflate.md).[push](asyncdeflate.md#push)*

*Overrides [AsyncInflate](asyncinflate.md).[push](asyncinflate.md#push)*

Pushes a chunk to be deflated

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the final chunk  |

**Returns:** void
