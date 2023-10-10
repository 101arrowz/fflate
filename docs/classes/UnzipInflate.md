# Class: UnzipInflate

Streaming DEFLATE decompression for ZIP archives. Prefer AsyncZipInflate for
better performance.

## Implements

- [`UnzipDecoder`](../interfaces/UnzipDecoder.md)

## Table of contents

### Constructors

- [constructor](UnzipInflate.md#constructor)

### Properties

- [ondata](UnzipInflate.md#ondata)
- [compression](UnzipInflate.md#compression)

### Methods

- [push](UnzipInflate.md#push)

## Constructors

### constructor

• **new UnzipInflate**()

Creates a DEFLATE decompression that can be used in ZIP archives

## Properties

### ondata

• **ondata**: [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

#### Implementation of

[UnzipDecoder](../interfaces/UnzipDecoder.md).[ondata](../interfaces/UnzipDecoder.md#ondata)

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
