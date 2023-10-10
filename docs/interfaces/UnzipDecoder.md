# Interface: UnzipDecoder

A decoder for files in ZIP streams

## Implemented by

- [`AsyncUnzipInflate`](../classes/AsyncUnzipInflate.md)
- [`UnzipInflate`](../classes/UnzipInflate.md)
- [`UnzipPassThrough`](../classes/UnzipPassThrough.md)

## Table of contents

### Properties

- [ondata](UnzipDecoder.md#ondata)
- [terminate](UnzipDecoder.md#terminate)

### Methods

- [push](UnzipDecoder.md#push)

## Properties

### ondata

• **ondata**: [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

___

### terminate

• `Optional` **terminate**: [`AsyncTerminable`](AsyncTerminable.md)

A method to terminate any internal workers used by the stream. Subsequent
calls to push() should silently fail.

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
