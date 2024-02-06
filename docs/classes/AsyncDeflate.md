# Class: AsyncDeflate

Asynchronous streaming DEFLATE compression

## Table of contents

### Constructors

- [constructor](AsyncDeflate.md#constructor)

### Properties

- [ondata](AsyncDeflate.md#ondata)
- [ondrain](AsyncDeflate.md#ondrain)
- [queuedSize](AsyncDeflate.md#queuedsize)
- [terminate](AsyncDeflate.md#terminate)

### Methods

- [flush](AsyncDeflate.md#flush)
- [push](AsyncDeflate.md#push)

## Constructors

### constructor

• **new AsyncDeflate**(`opts`, `cb?`)

Creates an asynchronous DEFLATE stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`DeflateOptions`](../interfaces/DeflateOptions.md) | The compression options |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated |

• **new AsyncDeflate**(`cb?`)

Creates an asynchronous DEFLATE stream

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
deflated output for small inputs.

#### Returns

`void`

___

### push

▸ **push**(`chunk`, `final?`): `void`

Pushes a chunk to be deflated

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
