# Class: AsyncUnzipInflate

Asynchronous streaming DEFLATE decompression for ZIP archives

## Implements

- [`UnzipDecoder`](../interfaces/UnzipDecoder.md)

## Table of contents

### Constructors

- [constructor](AsyncUnzipInflate.md#constructor)

### Properties

- [ondata](AsyncUnzipInflate.md#ondata)
- [terminate](AsyncUnzipInflate.md#terminate)
- [compression](AsyncUnzipInflate.md#compression)

### Methods

- [push](AsyncUnzipInflate.md#push)

## Constructors

### constructor

• **new AsyncUnzipInflate**(`_`, `sz?`)

Creates a DEFLATE decompression that can be used in ZIP archives

#### Parameters

| Name | Type |
| :------ | :------ |
| `_` | `string` |
| `sz?` | `number` |

## Properties

### ondata

• **ondata**: [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

#### Implementation of

[UnzipDecoder](../interfaces/UnzipDecoder.md).[ondata](../interfaces/UnzipDecoder.md#ondata)

___

### terminate

• **terminate**: [`AsyncTerminable`](../interfaces/AsyncTerminable.md)

A method to terminate any internal workers used by the stream. Subsequent
calls to push() should silently fail.

#### Implementation of

[UnzipDecoder](../interfaces/UnzipDecoder.md).[terminate](../interfaces/UnzipDecoder.md#terminate)

___

### compression

▪ `Static` **compression**: `number` = `8`

## Methods

### push

▸ **push**(`data`, `final`): `void`

Pushes a chunk to be decompressed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data in this chunk. Do not consume (detach) this data. |
| `final` | `boolean` | Whether this is the last chunk in the data stream |

#### Returns

`void`

#### Implementation of

[UnzipDecoder](../interfaces/UnzipDecoder.md).[push](../interfaces/UnzipDecoder.md#push)
