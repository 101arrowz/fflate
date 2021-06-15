# Interface: UnzipFile

Streaming file extraction from ZIP archives

## Hierarchy

* **UnzipFile**

## Index

### Properties

* [compression](unzipfile.md#compression)
* [name](unzipfile.md#name)
* [ondata](unzipfile.md#ondata)
* [originalSize](unzipfile.md#originalsize)
* [size](unzipfile.md#size)
* [terminate](unzipfile.md#terminate)

### Methods

* [start](unzipfile.md#start)

## Properties

### compression

•  **compression**: number

The compression format for the data stream. This number is determined by
the spec in PKZIP's APPNOTE.txt, section 4.4.5. For example, 0 = no
compression, 8 = deflate, 14 = LZMA. If start() is called but there is no
decompression stream available for this method, start() will throw.

___

### name

•  **name**: string

The name of the file

___

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

___

### originalSize

• `Optional` **originalSize**: number

The original size of the file. Will not be present for archives created
in a streaming fashion.

___

### size

• `Optional` **size**: number

The compressed size of the file. Will not be present for archives created
in a streaming fashion.

___

### terminate

•  **terminate**: [AsyncTerminable](asyncterminable.md)

A method to terminate any internal workers used by the stream. ondata
will not be called any further.

## Methods

### start

▸ **start**(): void

Starts reading from the stream. Calling this function will always enable
this stream, but ocassionally the stream will be enabled even without
this being called.

**Returns:** void
