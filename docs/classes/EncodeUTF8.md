# Class: EncodeUTF8

Streaming UTF-8 encoding

## Table of contents

### Constructors

- [constructor](EncodeUTF8.md#constructor)

### Properties

- [ondata](EncodeUTF8.md#ondata)

### Methods

- [push](EncodeUTF8.md#push)

## Constructors

### constructor

• **new EncodeUTF8**(`cb?`)

Creates a UTF-8 decoding stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is encoded |

## Properties

### ondata

• **ondata**: [`FlateStreamHandler`](../README.md#flatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`, `final?`): `void`

Pushes a chunk to be encoded to UTF-8

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `string` | The string data to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
