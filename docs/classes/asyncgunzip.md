# Class: AsyncGunzip

Asynchronous streaming single or multi-member GZIP decompression

## Table of contents

### Constructors

- [constructor](AsyncGunzip.md#constructor)

### Properties

- [ondata](AsyncGunzip.md#ondata)
- [onmember](AsyncGunzip.md#onmember)
- [terminate](AsyncGunzip.md#terminate)

### Methods

- [push](AsyncGunzip.md#push)

## Constructors

### constructor

• **new AsyncGunzip**(`opts`, `cb?`)

Creates an asynchronous GUNZIP stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`GunzipStreamOptions`](../interfaces/GunzipStreamOptions.md) | The decompression options |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is inflated |

• **new AsyncGunzip**(`cb?`)

Creates an asynchronous GUNZIP stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is inflated |

## Properties

### ondata

• **ondata**: [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

___

### onmember

• `Optional` **onmember**: [`GunzipMemberHandler`](../README.md#gunzipmemberhandler)

The handler to call whenever a new GZIP member is found

___

### terminate

• **terminate**: [`AsyncTerminable`](../interfaces/AsyncTerminable.md)

A method to terminate the stream's internal worker. Subsequent calls to
push() will silently fail.

## Methods

### push

▸ **push**(`chunk`, `final?`): `void`

Pushes a chunk to be GUNZIPped

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
