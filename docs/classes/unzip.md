# Class: Unzip

A ZIP archive decompression stream that emits files as they are discovered

## Table of contents

### Constructors

- [constructor](Unzip.md#constructor)

### Properties

- [onfile](Unzip.md#onfile)

### Methods

- [push](Unzip.md#push)
- [register](Unzip.md#register)

## Constructors

### constructor

• **new Unzip**(`cb?`)

Creates a ZIP decompression stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`UnzipFileHandler`](../README.md#unzipfilehandler) | The callback to call whenever a file in the ZIP archive is found |

## Properties

### onfile

• **onfile**: [`UnzipFileHandler`](../README.md#unzipfilehandler)

The handler to call whenever a file is discovered

## Methods

### push

▸ **push**(`chunk`, `final?`): `any`

Pushes a chunk to be unzipped

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`any`

___

### register

▸ **register**(`decoder`): `void`

Registers a decoder with the stream, allowing for files compressed with
the compression type provided to be expanded correctly

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `decoder` | [`UnzipDecoderConstructor`](../interfaces/UnzipDecoderConstructor.md) | The decoder constructor |

#### Returns

`void`
