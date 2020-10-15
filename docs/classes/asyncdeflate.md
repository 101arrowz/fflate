# Class: AsyncDeflate

Asynchronous streaming DEFLATE compression

## Hierarchy

* AsyncCmpStrm\<[DeflateOptions](../interfaces/deflateoptions.md)>

  ↳ **AsyncDeflate**

## Index

### Constructors

* [constructor](asyncdeflate.md#constructor)

### Properties

* [ondata](asyncdeflate.md#ondata)

### Methods

* [push](asyncdeflate.md#push)

## Constructors

### constructor

\+ **new AsyncDeflate**(`opts`: [DeflateOptions](../interfaces/deflateoptions.md), `cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncDeflate](asyncdeflate.md)

*Inherited from [AsyncDeflate](asyncdeflate.md).[constructor](asyncdeflate.md#constructor)*

*Overrides [AsyncInflate](asyncinflate.md).[constructor](asyncinflate.md#constructor)*

Creates an asynchronous compression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`opts` | [DeflateOptions](../interfaces/deflateoptions.md) | The compression options |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncDeflate](asyncdeflate.md)

\+ **new AsyncDeflate**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncDeflate](asyncdeflate.md)

*Inherited from [AsyncDeflate](asyncdeflate.md).[constructor](asyncdeflate.md#constructor)*

*Overrides [AsyncInflate](asyncinflate.md).[constructor](asyncinflate.md#constructor)*

Creates an asynchronous compression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncDeflate](asyncdeflate.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

*Inherited from [AsyncDeflate](asyncdeflate.md).[ondata](asyncdeflate.md#ondata)*

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
