# Class: Zip

A zippable archive to which files can incrementally be added

## Hierarchy

* **Zip**

## Index

### Constructors

* [constructor](zip.md#constructor)

### Properties

* [ondata](zip.md#ondata)

### Methods

* [add](zip.md#add)
* [end](zip.md#end)
* [terminate](zip.md#terminate)

## Constructors

### constructor

\+ **new Zip**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [Zip](zip.md)

Creates an empty ZIP archive to which files can be added

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data for the generated ZIP archive           is available  |

**Returns:** [Zip](zip.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

## Methods

### add

▸ **add**(`file`: [ZipInputFile](../interfaces/zipinputfile.md)): void

Adds a file to the ZIP archive

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`file` | [ZipInputFile](../interfaces/zipinputfile.md) | The file stream to add  |

**Returns:** void

___

### end

▸ **end**(): void

Ends the process of adding files and prepares to emit the final chunks.
This *must* be called after adding all desired files for the resulting
ZIP file to work properly.

**Returns:** void

___

### terminate

▸ **terminate**(): void

A method to terminate any internal workers used by the stream. Subsequent
calls to add() will fail.

**Returns:** void
