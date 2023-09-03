# Class: AsyncDecompress

Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression

## Table of contents

### Constructors

- [constructor](AsyncDecompress.md#constructor)

### Properties

- [ondata](AsyncDecompress.md#ondata)

### Methods

- [push](AsyncDecompress.md#push)

## Constructors

### constructor

• **new AsyncDecompress**(`opts`, `cb?`)

Creates an asynchronous decompression stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`InflateStreamOptions`](../interfaces/InflateStreamOptions.md) | The decompression options |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is decompressed |

• **new AsyncDecompress**(`cb?`)

Creates an asynchronous decompression stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is decompressed |

## Properties

### ondata

• **ondata**: [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`, `final?`): `void`

Pushes a chunk to be decompressed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
