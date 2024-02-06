# Class: Zlib

Streaming Zlib compression

## Table of contents

### Constructors

- [constructor](Zlib.md#constructor)

### Properties

- [ondata](Zlib.md#ondata)

### Methods

- [flush](Zlib.md#flush)
- [push](Zlib.md#push)

## Constructors

### constructor

• **new Zlib**(`opts`, `cb?`)

Creates a Zlib stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`ZlibOptions`](../interfaces/ZlibOptions.md) | The compression options |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is deflated |

• **new Zlib**(`cb?`)

Creates a Zlib stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`FlateStreamHandler`](../README.md#flatestreamhandler) | The callback to call whenever data is deflated |

## Properties

### ondata

• **ondata**: [`FlateStreamHandler`](../README.md#flatestreamhandler)

The handler to call whenever data is available

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

Pushes a chunk to be zlibbed

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
