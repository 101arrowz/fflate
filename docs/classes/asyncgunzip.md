# Class: AsyncGunzip

Asynchronous streaming GZIP decompression

## Hierarchy

* **AsyncGunzip**

## Index

### Constructors

* [constructor](asyncgunzip.md#constructor)

### Properties

* [ondata](asyncgunzip.md#ondata)

### Methods

* [push](asyncgunzip.md#push)

## Constructors

### constructor

\+ **new AsyncGunzip**(`cb`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGunzip](asyncgunzip.md)

Creates an asynchronous GUNZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncGunzip](asyncgunzip.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be GUNZIPped

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
