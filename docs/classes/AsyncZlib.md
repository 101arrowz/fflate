# Class: AsyncZlib

Asynchronous streaming Zlib compression

## Table of contents

### Constructors

- [constructor](AsyncZlib.md#constructor)

### Properties

- [ondata](AsyncZlib.md#ondata)
- [terminate](AsyncZlib.md#terminate)

### Methods

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

### terminate

• **terminate**: [`AsyncTerminable`](../interfaces/AsyncTerminable.md)

A method to terminate the stream's internal worker. Subsequent calls to
push() will silently fail.

## Methods

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
