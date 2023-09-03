# Class: AsyncZipDeflate

Asynchronous streaming DEFLATE compression for ZIP archives

## Implements

- [`ZipInputFile`](../interfaces/ZipInputFile.md)

## Table of contents

### Constructors

- [constructor](AsyncZipDeflate.md#constructor)

### Properties

- [attrs](AsyncZipDeflate.md#attrs)
- [comment](AsyncZipDeflate.md#comment)
- [compression](AsyncZipDeflate.md#compression)
- [crc](AsyncZipDeflate.md#crc)
- [extra](AsyncZipDeflate.md#extra)
- [filename](AsyncZipDeflate.md#filename)
- [flag](AsyncZipDeflate.md#flag)
- [mtime](AsyncZipDeflate.md#mtime)
- [ondata](AsyncZipDeflate.md#ondata)
- [os](AsyncZipDeflate.md#os)
- [size](AsyncZipDeflate.md#size)
- [terminate](AsyncZipDeflate.md#terminate)

### Methods

- [process](AsyncZipDeflate.md#process)
- [push](AsyncZipDeflate.md#push)

## Constructors

### constructor

• **new AsyncZipDeflate**(`filename`, `opts?`)

Creates an asynchronous DEFLATE stream that can be added to ZIP archives

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | The filename to associate with this data stream |
| `opts?` | [`DeflateOptions`](../interfaces/DeflateOptions.md) | The compression options |

## Properties

### attrs

• `Optional` **attrs**: `number`

The file's attributes. These are traditionally somewhat complicated
and platform-dependent, so using them is scarcely necessary. However,
here is a representation of what this is, bit by bit:

`TTTTugtrwxrwxrwx0000000000ADVSHR`

TTTT = file type (rarely useful)

u = setuid, g = setgid, t = sticky

rwx = user permissions, rwx = group permissions, rwx = other permissions

0000000000 = unused

A = archive, D = directory, V = volume label, S = system file, H = hidden, R = read-only

If you want to set the Unix permissions, for instance, just bit shift by 16, e.g. 0o644 << 16.
Note that attributes usually only work in conjunction with the `os` setting: you must use
`os` = 3 (Unix) if you want to set Unix permissions

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[attrs](../interfaces/ZipInputFile.md#attrs)

___

### comment

• `Optional` **comment**: `string`

The comment to attach to the file. This field is defined by PKZIP's APPNOTE.txt,
section 4.4.26. The comment must be at most 65,535 bytes long UTF-8 encoded. This
field is not read by consumer software.

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[comment](../interfaces/ZipInputFile.md#comment)

___

### compression

• **compression**: `number`

The compression format for the data stream. This number is determined by
the spec in PKZIP's APPNOTE.txt, section 4.4.5. For example, 0 = no
compression, 8 = deflate, 14 = LZMA

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[compression](../interfaces/ZipInputFile.md#compression)

___

### crc

• **crc**: `number`

A CRC of the original file contents. This attribute may be invalid after
the file is added to the ZIP archive; it must be correct only before the
stream completes.

If you don't want to have to generate this yourself, consider extending the
ZipPassThrough class and overriding its process() method, or using one of
ZipDeflate or AsyncZipDeflate.

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[crc](../interfaces/ZipInputFile.md#crc)

___

### extra

• `Optional` **extra**: `Record`<`number`, `Uint8Array`\>

Extra metadata to add to the file. This field is defined by PKZIP's APPNOTE.txt,
section 4.4.28. At most 65,535 bytes may be used in each ID. The ID must be an
integer between 0 and 65,535, inclusive.

This field is incredibly rare and almost never needed except for compliance with
proprietary standards and software.

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[extra](../interfaces/ZipInputFile.md#extra)

___

### filename

• **filename**: `string`

The filename to associate with the data provided to this stream. If you
want a file in a subdirectory, use forward slashes as a separator (e.g.
`directory/filename.ext`). This will still work on Windows.

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[filename](../interfaces/ZipInputFile.md#filename)

___

### flag

• **flag**: ``0`` \| ``2`` \| ``1`` \| ``3``

Bits 1 and 2 of the general purpose bit flag, specified in PKZIP's
APPNOTE.txt, section 4.4.4. Should be between 0 and 3. This is unlikely
to be necessary.

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[flag](../interfaces/ZipInputFile.md#flag)

___

### mtime

• `Optional` **mtime**: `string` \| `number` \| `Date`

When the file was last modified. Defaults to the current time.

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[mtime](../interfaces/ZipInputFile.md#mtime)

___

### ondata

• **ondata**: [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler)

The handler to be called when data is added. After passing this stream to
the ZIP file object, this handler will always be defined. To call it:

`stream.ondata(error, chunk, final)`

error = any error that occurred (null if there was no error)

chunk = a Uint8Array of the data that was added (null if there was an
error)

final = boolean, whether this is the final chunk in the stream

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[ondata](../interfaces/ZipInputFile.md#ondata)

___

### os

• `Optional` **os**: `number`

The operating system of origin for this file. The value is defined
by PKZIP's APPNOTE.txt, section 4.4.2.2. For example, 0 (the default)
is MS/DOS, 3 is Unix, 19 is macOS.

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[os](../interfaces/ZipInputFile.md#os)

___

### size

• **size**: `number`

The size of the file in bytes. This attribute may be invalid after
the file is added to the ZIP archive; it must be correct only before the
stream completes.

If you don't want to have to compute this yourself, consider extending the
ZipPassThrough class and overriding its process() method, or using one of
ZipDeflate or AsyncZipDeflate.

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[size](../interfaces/ZipInputFile.md#size)

___

### terminate

• **terminate**: [`AsyncTerminable`](../interfaces/AsyncTerminable.md)

A method called when the stream is no longer needed, for clean-up
purposes. This will not always be called after the stream completes,
so you may wish to call this.terminate() after the final chunk is
processed if you have clean-up logic.

#### Implementation of

[ZipInputFile](../interfaces/ZipInputFile.md).[terminate](../interfaces/ZipInputFile.md#terminate)

## Methods

### process

▸ **process**(`chunk`, `final`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `Uint8Array` |
| `final` | `boolean` |

#### Returns

`void`

___

### push

▸ **push**(`chunk`, `final?`): `void`

Pushes a chunk to be deflated

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunk` | `Uint8Array` | The chunk to push |
| `final?` | `boolean` | Whether this is the last chunk |

#### Returns

`void`
