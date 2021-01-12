# Class: EncodeUTF8

Streaming UTF-8 encoding

## Hierarchy

* **EncodeUTF8**

## Index

### Constructors

* [constructor](encodeutf8.md#constructor)

### Properties

* [ondata](encodeutf8.md#ondata)

### Methods

* [push](encodeutf8.md#push)

## Constructors

### constructor

\+ **new EncodeUTF8**(`cb?`: [FlateStreamHandler](../README.md#flatestreamhandler)): [EncodeUTF8](encodeutf8.md)

Creates a UTF-8 decoding stream

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cb?` | [FlateStreamHandler](../README.md#flatestreamhandler) | The callback to call whenever data is encoded  |

**Returns:** [EncodeUTF8](encodeutf8.md)

## Properties

### ondata

•  **ondata**: [FlateStreamHandler](../README.md#flatestreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: string, `final?`: boolean): void

Pushes a chunk to be encoded to UTF-8

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | string | The string data to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
