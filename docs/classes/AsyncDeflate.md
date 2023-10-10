# Class: AsyncDeflate

Asynchronous streaming DEFLATE compression

## Table of contents

### Constructors

- [constructor](AsyncDeflate.md#constructor)

### Properties

- [ondata](AsyncDeflate.md#ondata)
- [terminate](AsyncDeflate.md#terminate)

### Methods

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
