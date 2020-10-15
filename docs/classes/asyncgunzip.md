# Class: AsyncGunzip

Asynchronous streaming GZIP decompression

## Hierarchy

* AsyncStrm

  ↳ **AsyncGunzip**

## Index

### Constructors

* [constructor](asyncgunzip.md#constructor)

### Properties

* [ondata](asyncgunzip.md#ondata)

### Methods

* [push](asyncgunzip.md#push)

## Constructors

### constructor

\+ **new AsyncGunzip**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGunzip](asyncgunzip.md)

*Inherited from [AsyncInflate](asyncinflate.md).[constructor](asyncinflate.md#constructor)*

Creates an asynchronous decompression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is inflated  |

**Returns:** [AsyncGunzip](asyncgunzip.md)

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
