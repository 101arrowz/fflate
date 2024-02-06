# Class: AsyncDecompress

Asynchronous streaming GZIP, Zlib, or raw DEFLATE decompression

## Table of contents

### Constructors

- [constructor](AsyncDecompress.md#constructor)

### Properties

- [ondata](AsyncDecompress.md#ondata)
- [ondrain](AsyncDecompress.md#ondrain)
- [queuedSize](AsyncDecompress.md#queuedsize)

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

___

### ondrain

• `Optional` **ondrain**: [`AsyncFlateDrainHandler`](../README.md#asyncflatedrainhandler)

The handler to call whenever buffered source data is processed (i.e. `queuedSize` updates)

___

### queuedSize

• **queuedSize**: `number`

The number of compressed bytes buffered in the stream

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
