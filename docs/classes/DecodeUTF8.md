# Class: DecodeUTF8

Streaming UTF-8 decoding

## Table of contents

### Constructors

- [constructor](DecodeUTF8.md#constructor)

### Properties

- [ondata](DecodeUTF8.md#ondata)

### Methods

- [push](DecodeUTF8.md#push)

## Constructors

### constructor

• **new DecodeUTF8**(`cb?`)

Creates a UTF-8 decoding stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`StringStreamHandler`](../README.md#stringstreamhandler) | The callback to call whenever data is decoded |

## Properties

### ondata

• **ondata**: [`StringStreamHandler`](../README.md#stringstreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`, `final?`): `void`

Pushes a chunk to be decoded from UTF-8 binary

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
