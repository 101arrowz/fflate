# Class: AsyncUnzlib

Asynchronous streaming Zlib decompression

## Table of contents

### Constructors

- [constructor](AsyncUnzlib.md#constructor)

### Properties

- [ondata](AsyncUnzlib.md#ondata)
- [ondrain](AsyncUnzlib.md#ondrain)
- [queuedSize](AsyncUnzlib.md#queuedsize)
- [terminate](AsyncUnzlib.md#terminate)

### Methods

- [push](AsyncUnzlib.md#push)

## Constructors

### constructor

• **new AsyncUnzlib**(`opts`, `cb?`)

Creates an asynchronous Zlib decompression stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`UnzlibStreamOptions`](../interfaces/UnzlibStreamOptions.md) | The decompression options |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is inflated |

• **new AsyncUnzlib**(`cb?`)

Creates an asynchronous Zlib decompression stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is inflated |

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

___

### terminate

• **terminate**: [`AsyncTerminable`](../interfaces/AsyncTerminable.md)

A method to terminate the stream's internal worker. Subsequent calls to
push() will silently fail.

## Methods

### push

▸ **push**(`chunk`, `final?`): `void`

Pushes a chunk to be decompressed from Zlib

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
