# Class: AsyncGunzip

Asynchronous streaming single or multi-member GZIP decompression

## Hierarchy

* **AsyncGunzip**

## Index

### Constructors

* [constructor](asyncgunzip.md#constructor)

### Properties

* [ondata](asyncgunzip.md#ondata)
* [onmember](asyncgunzip.md#onmember)
* [terminate](asyncgunzip.md#terminate)

### Methods

* [push](asyncgunzip.md#push)

## Constructors

### constructor

\+ **new AsyncGunzip**(`opts`: [GunzipStreamOptions](../interfaces/gunzipstreamoptions.md), `cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGunzip](asyncgunzip.md)

Creates an asynchronous GUNZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`opts` | [GunzipStreamOptions](../interfaces/gunzipstreamoptions.md) | The decompression options |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is inflated  |

**Returns:** [AsyncGunzip](asyncgunzip.md)

\+ **new AsyncGunzip**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncGunzip](asyncgunzip.md)

Creates an asynchronous GUNZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is inflated  |

**Returns:** [AsyncGunzip](asyncgunzip.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

___

### onmember

• `Optional` **onmember**: [GunzipMemberHandler](../README.md#gunzipmemberhandler)

The handler to call whenever a new GZIP member is found

___

### terminate

•  **terminate**: [AsyncTerminable](../interfaces/asyncterminable.md)

A method to terminate the stream's internal worker. Subsequent calls to
push() will silently fail.

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
