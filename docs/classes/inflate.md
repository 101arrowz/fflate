# Class: Inflate

Streaming DEFLATE decompression

## Hierarchy

* **Inflate**

## Index

### Constructors

* [constructor](inflate.md#constructor)

### Properties

* [ondata](inflate.md#ondata)

### Methods

* [push](inflate.md#push)

## Constructors

### constructor

\+ **new Inflate**(`cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Inflate](inflate.md)

Creates an inflation stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is inflated  |

**Returns:** [Inflate](inflate.md)

## Properties

### ondata

•  **ondata**: [FlateStreamHandler](../README.md#flatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be inflated

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the final chunk  |

**Returns:** void
