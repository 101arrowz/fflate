# Class: AsyncZlib

Asynchronous streaming Zlib compression

## Table of contents

### Constructors

- [constructor](AsyncZlib.md#constructor)

### Properties

- [ondata](AsyncZlib.md#ondata)
- [ondrain](AsyncZlib.md#ondrain)
- [queuedSize](AsyncZlib.md#queuedsize)
- [terminate](AsyncZlib.md#terminate)

### Methods

- [flush](AsyncZlib.md#flush)
- [push](AsyncZlib.md#push)

## Constructors

### constructor

• **new AsyncZlib**(`opts`, `cb?`)

Creates an asynchronous Zlib stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`ZlibOptions`](../interfaces/ZlibOptions.md) | The compression options |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated |

• **new AsyncZlib**(`cb?`)

Creates an asynchronous Zlib stream

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
zlibbed output for small inputs.

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
