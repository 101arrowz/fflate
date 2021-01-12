# Interface: UnzipFile

Streaming file extraction from ZIP archives

## Hierarchy

* **UnzipFile**

## Index

### Properties

* [ondata](unzipfile.md#ondata)
* [terminate](unzipfile.md#terminate)

### Methods

* [start](unzipfile.md#start)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

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
