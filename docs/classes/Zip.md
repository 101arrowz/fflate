# Class: Zip

A zippable archive to which files can incrementally be added

## Table of contents

### Constructors

- [constructor](Zip.md#constructor)

### Properties

- [ondata](Zip.md#ondata)

### Methods

- [add](Zip.md#add)
- [end](Zip.md#end)
- [terminate](Zip.md#terminate)

## Constructors

### constructor

• **new Zip**(`cb?`)

Creates an empty ZIP archive to which files can be added

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb?` | [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler) | The callback to call whenever data for the generated ZIP archive is available |

## Properties

### ondata

• **ondata**: [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

## Methods

### add

▸ **add**(`file`): `void`

Adds a file to the ZIP archive

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `file` | [`ZipInputFile`](../interfaces/ZipInputFile.md) | The file stream to add |

#### Returns

`void`

___

### end

▸ **end**(): `void`

Ends the process of adding files and prepares to emit the final chunks.
This *must* be called after adding all desired files for the resulting
ZIP file to work properly.

#### Returns

`void`

___

### terminate

▸ **terminate**(): `void`

A method to terminate any internal workers used by the stream. Subsequent
calls to add() will fail.

#### Returns

`void`
