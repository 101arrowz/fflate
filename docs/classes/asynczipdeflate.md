# Class: AsyncZipDeflate

Asynchronous streaming DEFLATE compression for ZIP archives

## Hierarchy

* **AsyncZipDeflate**

## Implements

* [ZipInputFile](../interfaces/zipinputfile.md)

## Index

### Constructors

* [constructor](asynczipdeflate.md#constructor)

### Properties

* [attrs](asynczipdeflate.md#attrs)
* [compression](asynczipdeflate.md#compression)
* [crc](asynczipdeflate.md#crc)
* [filename](asynczipdeflate.md#filename)
* [flag](asynczipdeflate.md#flag)
* [mtime](asynczipdeflate.md#mtime)
* [ondata](asynczipdeflate.md#ondata)
* [os](asynczipdeflate.md#os)
* [size](asynczipdeflate.md#size)
* [terminate](asynczipdeflate.md#terminate)

### Methods

* [process](asynczipdeflate.md#process)
* [push](asynczipdeflate.md#push)

## Constructors

### constructor

\+ **new AsyncZipDeflate**(`filename`: string, `opts`: [DeflateOptions](../interfaces/deflateoptions.md)): [AsyncZipDeflate](asynczipdeflate.md)

Creates a DEFLATE stream that can be added to ZIP archives

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`filename` | string | - | The filename to associate with this data stream |
`opts` | [DeflateOptions](../interfaces/deflateoptions.md) | {} | The compression options  |

**Returns:** [AsyncZipDeflate](asynczipdeflate.md)

## Properties

### attrs

• `Optional` **attrs**: number

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[attrs](../interfaces/zipinputfile.md#attrs)*

___

### compression

•  **compression**: number

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[compression](../interfaces/zipinputfile.md#compression)*

___

### crc

•  **crc**: number

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[crc](../interfaces/zipinputfile.md#crc)*

___

### filename

•  **filename**: string

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[filename](../interfaces/zipinputfile.md#filename)*

___

### flag

•  **flag**: 0 \| 1 \| 2 \| 3

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[flag](../interfaces/zipinputfile.md#flag)*

___

### mtime

• `Optional` **mtime**: GzipOptions[\"mtime\"]

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[mtime](../interfaces/zipinputfile.md#mtime)*

___

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[ondata](../interfaces/zipinputfile.md#ondata)*

___

### os

• `Optional` **os**: number

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[os](../interfaces/zipinputfile.md#os)*

___

### size

•  **size**: number

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[size](../interfaces/zipinputfile.md#size)*

___

### terminate

•  **terminate**: [AsyncTerminable](../interfaces/asyncterminable.md)

*Implementation of [ZipInputFile](../interfaces/zipinputfile.md).[terminate](../interfaces/zipinputfile.md#terminate)*

## Methods

### process

▸ **process**(`chunk`: Uint8Array, `final`: boolean): void

#### Parameters:

Name | Type |
------ | ------ |
`chunk` | Uint8Array |
`final` | boolean |

**Returns:** void

___

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be deflated

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
