# Class: Unzip

A ZIP archive decompression stream that emits files as they are discovered

## Hierarchy

* **Unzip**

## Index

### Constructors

* [constructor](unzip.md#constructor)

### Properties

* [onfile](unzip.md#onfile)

### Methods

* [push](unzip.md#push)
* [register](unzip.md#register)

## Constructors

### constructor

\+ **new Unzip**(`cb?`: [UnzipFileHandler](../README.md#unzipfilehandler)): [Unzip](unzip.md)

Creates a ZIP decompression stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [UnzipFileHandler](../README.md#unzipfilehandler) | The callback to call whenever a file in the ZIP archive is found  |

**Returns:** [Unzip](unzip.md)

## Properties

### onfile

•  **onfile**: [UnzipFileHandler](../README.md#unzipfilehandler)

The handler to call whenever a file is discovered

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): any

Pushes a chunk to be unzipped

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** any

___

### register

▸ **register**(`decoder`: [UnzipDecoderConstructor](../interfaces/unzipdecoderconstructor.md)): void

Registers a decoder with the stream, allowing for files compressed with
the compression type provided to be expanded correctly

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`decoder` | [UnzipDecoderConstructor](../interfaces/unzipdecoderconstructor.md) | The decoder constructor  |

**Returns:** void
