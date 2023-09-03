# Class: Unzlib

Streaming Zlib decompression

## Table of contents

### Constructors

- [constructor](Unzlib.md#constructor)

### Properties

- [ondata](Unzlib.md#ondata)

### Methods

- [push](Unzlib.md#push)

## Constructors

### constructor

• **new Unzlib**(`opts`, `cb?`)

Creates a Zlib decompression stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`UnzlibStreamOptions`](../interfaces/UnzlibStreamOptions.md) | The decompression options |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is inflated |

• **new Unzlib**(`cb?`)

Creates a Zlib decompression stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is inflated |

## Properties

### ondata

• **ondata**: [`FlateStreamHandler`](../README.md#flatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`, `final?`): `void`

Pushes a chunk to be unzlibbed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
