# Class: Decompress

Streaming GZIP, Zlib, or raw DEFLATE decompression

## Table of contents

### Constructors

- [constructor](Decompress.md#constructor)

### Properties

- [ondata](Decompress.md#ondata)

### Methods

- [push](Decompress.md#push)

## Constructors

### constructor

• **new Decompress**(`opts`, `cb?`)

Creates a decompression stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`InflateStreamOptions`](../interfaces/InflateStreamOptions.md) | The decompression options |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is decompressed |

• **new Decompress**(`cb?`)

Creates a decompression stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is decompressed |

## Properties

### ondata

• **ondata**: [`FlateStreamHandler`](../README.md#flatestreamhandler)

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
