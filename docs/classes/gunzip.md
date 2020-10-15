# Class: Gunzip

Streaming GZIP decompression

## Hierarchy

* **Gunzip**

## Index

### Constructors

* [constructor](gunzip.md#constructor)

### Properties

* [ondata](gunzip.md#ondata)

### Methods

* [push](gunzip.md#push)

## Constructors

### constructor

\+ **new Gunzip**(`cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [Gunzip](gunzip.md)

Creates a GUNZIP stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is inflated  |

**Returns:** [Gunzip](gunzip.md)

## Properties

### ondata

•  **ondata**: [FlateStreamHandler](../README.md#flatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be GUNZIPped

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
