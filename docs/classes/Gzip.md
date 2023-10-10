# Class: Gzip

Streaming GZIP compression

## Table of contents

### Constructors

- [constructor](Gzip.md#constructor)

### Properties

- [ondata](Gzip.md#ondata)

### Methods

- [push](Gzip.md#push)

## Constructors

### constructor

• **new Gzip**(`opts`, `cb?`)

Creates a GZIP stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`GzipOptions`](../interfaces/GzipOptions.md) | The compression options |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is deflated |

• **new Gzip**(`cb?`)

Creates a GZIP stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is deflated |

## Properties

### ondata

• **ondata**: [`FlateStreamHandler`](../README.md#flatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`, `final?`): `void`

Pushes a chunk to be GZIPped

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
