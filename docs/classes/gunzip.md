# Class: Gunzip

Streaming single or multi-member GZIP decompression

## Table of contents

### Constructors

- [constructor](Gunzip.md#constructor)

### Properties

- [ondata](Gunzip.md#ondata)
- [onmember](Gunzip.md#onmember)

### Methods

- [push](Gunzip.md#push)

## Constructors

### constructor

• **new Gunzip**(`opts`, `cb?`)

Creates a GUNZIP stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`GunzipStreamOptions`](../interfaces/GunzipStreamOptions.md) | The decompression options |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is inflated |

• **new Gunzip**(`cb?`)

Creates a GUNZIP stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is inflated |

## Properties

### ondata

• **ondata**: [`FlateStreamHandler`](../README.md#flatestreamhandler)

The handler to call whenever data is available

___

### onmember

• `Optional` **onmember**: [`GunzipMemberHandler`](../README.md#gunzipmemberhandler)

The handler to call whenever a new GZIP member is found

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
