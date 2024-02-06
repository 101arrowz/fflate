# Class: AsyncGzip

Asynchronous streaming GZIP compression

## Table of contents

### Constructors

- [constructor](AsyncGzip.md#constructor)

### Properties

- [ondata](AsyncGzip.md#ondata)
- [ondrain](AsyncGzip.md#ondrain)
- [queuedSize](AsyncGzip.md#queuedsize)
- [terminate](AsyncGzip.md#terminate)

### Methods

- [flush](AsyncGzip.md#flush)
- [push](AsyncGzip.md#push)

## Constructors

### constructor

• **new AsyncGzip**(`opts`, `cb?`)

Creates an asynchronous GZIP stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`GzipOptions`](../interfaces/GzipOptions.md) | The compression options |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated |

• **new AsyncGzip**(`cb?`)

Creates an asynchronous GZIP stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated |

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

The number of uncompressed bytes buffered in the stream

___

### terminate

• **terminate**: [`AsyncTerminable`](../interfaces/AsyncTerminable.md)

A method to terminate the stream's internal worker. Subsequent calls to
push() will silently fail.

## Methods

### flush

▸ **flush**(): `void`

Flushes buffered uncompressed data. Useful to immediately retrieve the
GZIPped output for small inputs.

#### Returns

`void`

___

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
