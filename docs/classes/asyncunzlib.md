# Class: AsyncUnzlib

Asynchronous streaming Zlib decompression

## Hierarchy

* AsyncStrm

  ↳ **AsyncUnzlib**

## Index

### Constructors

* [constructor](asyncunzlib.md#constructor)

### Properties

* [ondata](asyncunzlib.md#ondata)

### Methods

* [push](asyncunzlib.md#push)

## Constructors

### constructor

\+ **new AsyncUnzlib**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncUnzlib](asyncunzlib.md)

*Inherited from [AsyncInflate](asyncinflate.md).[constructor](asyncinflate.md#constructor)*

Creates an asynchronous decompression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is inflated  |

**Returns:** [AsyncUnzlib](asyncunzlib.md)

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
