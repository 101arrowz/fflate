# Class: ZipPassThrough

A pass-through stream to keep data uncompressed in a ZIP archive.

## Hierarchy

* **ZipPassThrough**

## Implements

* [ZipInputFile](../interfaces/zipinputfile.md)

## Index

### Constructors

* [constructor](zippassthrough.md#constructor)

### Properties

* [attrs](zippassthrough.md#attrs)
* [compression](zippassthrough.md#compression)
* [crc](zippassthrough.md#crc)
* [filename](zippassthrough.md#filename)
* [ondata](zippassthrough.md#ondata)
* [os](zippassthrough.md#os)
* [size](zippassthrough.md#size)

### Methods

* [push](zippassthrough.md#push)

## Constructors

### constructor

\+ **new ZipPassThrough**(`filename`: string): [ZipPassThrough](zippassthrough.md)

Creates a pass-through stream that can be added to ZIP archives

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`filename` | string | The filename to associate with this data stream  |

**Returns:** [ZipPassThrough](zippassthrough.md)

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

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be added. If you are subclassing this with a custom
compression algorithm, note that you must push data from the source
file only, pre-compression.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
