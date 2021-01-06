# Class: DecodeUTF8

Streaming UTF-8 decoding

## Hierarchy

* **DecodeUTF8**

## Index

### Constructors

* [constructor](decodeutf8.md#constructor)

### Properties

* [ondata](decodeutf8.md#ondata)

### Methods

* [push](decodeutf8.md#push)

## Constructors

### constructor

\+ **new DecodeUTF8**(`handler?`: [StringStreamHandler](../README.md#stringstreamhandler)): [DecodeUTF8](decodeutf8.md)

Creates a UTF-8 decoding stream

#### Parameters:

Name | Type |
------ | ------ |
`handler?` | [StringStreamHandler](../README.md#stringstreamhandler) |

**Returns:** [DecodeUTF8](decodeutf8.md)

## Properties

### ondata

•  **ondata**: [StringStreamHandler](../README.md#stringstreamhandler)

The handler to call whenever data is available

## Methods

### push

▸ **push**(`chunk`: Uint8Array, `final?`: boolean): void

Pushes a chunk to be decoded from UTF-8 binary

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`chunk` | Uint8Array | The chunk to push |
`final?` | boolean | Whether this is the last chunk  |

**Returns:** void
