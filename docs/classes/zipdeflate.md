# Class: ZipDeflate

Streaming DEFLATE compression for ZIP archives. Prefer using AsyncZipDeflate
for better performance

## Hierarchy

* **ZipDeflate**

## Implements

* [ZipInputFile](../interfaces/zipinputfile.md)

## Index

### Constructors

* [constructor](zipdeflate.md#constructor)

### Properties

* [attrs](zipdeflate.md#attrs)
* [compression](zipdeflate.md#compression)
* [crc](zipdeflate.md#crc)
* [filename](zipdeflate.md#filename)
* [flag](zipdeflate.md#flag)
* [ondata](zipdeflate.md#ondata)
* [os](zipdeflate.md#os)
* [size](zipdeflate.md#size)

### Methods

* [process](zipdeflate.md#process)
* [push](zipdeflate.md#push)

## Constructors

### constructor

\+ **new ZipDeflate**(`filename`: string, `opts`: [DeflateOptions](../interfaces/deflateoptions.md)): [ZipDeflate](zipdeflate.md)

Creates a DEFLATE stream that can be added to ZIP archives

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`filename` | string | - | The filename to associate with this data stream |
`opts` | [DeflateOptions](../interfaces/deflateoptions.md) | {} | The compression options  |

**Returns:** [ZipDeflate](zipdeflate.md)

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
