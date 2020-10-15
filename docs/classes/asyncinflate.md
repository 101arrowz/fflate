# Class: AsyncInflate

Asynchronous streaming DEFLATE decompression

## Hierarchy

* AsyncStrm

  ↳ **AsyncInflate**

## Index

### Constructors

* [constructor](asyncinflate.md#constructor)

### Properties

* [ondata](asyncinflate.md#ondata)

### Methods

* [push](asyncinflate.md#push)

## Constructors

### constructor

\+ **new AsyncInflate**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncInflate](asyncinflate.md)

*Inherited from [AsyncInflate](asyncinflate.md).[constructor](asyncinflate.md#constructor)*

Creates an asynchronous decompression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is inflated  |

**Returns:** [AsyncInflate](asyncinflate.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

*Inherited from [AsyncDeflate](asyncdeflate.md).[ondata](asyncdeflate.md#ondata)*

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

*Inherited from [AsyncInflate](asyncinflate.md).[push](asyncinflate.md#push)*

Pushes a chunk to be inflated

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the final chunk  |

**Returns:** void
