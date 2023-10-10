# Class: UnzipPassThrough

Streaming pass-through decompression for ZIP archives

## Implements

- [`UnzipDecoder`](../interfaces/UnzipDecoder.md)

## Table of contents

### Constructors

- [constructor](UnzipPassThrough.md#constructor)

### Properties

- [ondata](UnzipPassThrough.md#ondata)
- [compression](UnzipPassThrough.md#compression)

### Methods

- [push](UnzipPassThrough.md#push)

## Constructors

### constructor

• **new UnzipPassThrough**()

## Properties

### ondata

• **ondata**: [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

#### Implementation of

[UnzipDecoder](../interfaces/UnzipDecoder.md).[ondata](../interfaces/UnzipDecoder.md#ondata)

___

### compression

▪ `Static` **compression**: `number` = `0`

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
