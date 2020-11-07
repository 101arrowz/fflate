# Class: AsyncInflate

Asynchronous streaming DEFLATE decompression

## Hierarchy

* **AsyncInflate**

## Index

### Constructors

* [constructor](asyncinflate.md#constructor)

### Properties

* [ondata](asyncinflate.md#ondata)
* [terminate](asyncinflate.md#terminate)

### Methods

* [push](asyncinflate.md#push)

## Constructors

### constructor

\+ **new AsyncInflate**(`cb?`: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)): [AsyncInflate](asyncinflate.md)

Creates an asynchronous inflation stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler) | The callback to call whenever data is deflated  |

**Returns:** [AsyncInflate](asyncinflate.md)

## Properties

### ondata

•  **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to call whenever data is available

___

### terminate

•  **terminate**: [AsyncTerminable](../interfaces/asyncterminable.md)

A method to terminate the stream's internal worker. Subsequent calls to
push() will silently fail.

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be inflated

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
