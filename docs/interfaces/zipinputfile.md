# Interface: ZipInputFile

A stream that can be used to create a file in a ZIP archive

## Hierarchy

- [`ZipAttributes`](ZipAttributes.md)

  ↳ **`ZipInputFile`**

## Implemented by

- [`AsyncZipDeflate`](../classes/AsyncZipDeflate.md)
- [`ZipDeflate`](../classes/ZipDeflate.md)
- [`ZipPassThrough`](../classes/ZipPassThrough.md)

## Table of contents

### Properties

- [attrs](ZipInputFile.md#attrs)
- [comment](ZipInputFile.md#comment)
- [compression](ZipInputFile.md#compression)
- [crc](ZipInputFile.md#crc)
- [extra](ZipInputFile.md#extra)
- [filename](ZipInputFile.md#filename)
- [flag](ZipInputFile.md#flag)
- [mtime](ZipInputFile.md#mtime)
- [ondata](ZipInputFile.md#ondata)
- [os](ZipInputFile.md#os)
- [size](ZipInputFile.md#size)
- [terminate](ZipInputFile.md#terminate)

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

#### Inherited from

[ZipAttributes](ZipAttributes.md).[attrs](ZipAttributes.md#attrs)

___

### comment

• `Optional` **comment**: `string`

The comment to attach to the file. This field is defined by PKZIP's APPNOTE.txt,
section 4.4.26. The comment must be at most 65,535 bytes long UTF-8 encoded. This
field is not read by consumer software.

#### Inherited from

[ZipAttributes](ZipAttributes.md).[comment](ZipAttributes.md#comment)

___

### compression

• **compression**: `number`

The compression format for the data stream. This number is determined by
the spec in PKZIP's APPNOTE.txt, section 4.4.5. For example, 0 = no
compression, 8 = deflate, 14 = LZMA

___

### crc

• **crc**: `number`

A CRC of the original file contents. This attribute may be invalid after
the file is added to the ZIP archive; it must be correct only before the
stream completes.

If you don't want to have to generate this yourself, consider extending the
ZipPassThrough class and overriding its process() method, or using one of
ZipDeflate or AsyncZipDeflate.

___

### extra

• `Optional` **extra**: `Record`<`number`, `Uint8Array`\>

Extra metadata to add to the file. This field is defined by PKZIP's APPNOTE.txt,
section 4.4.28. At most 65,535 bytes may be used in each ID. The ID must be an
integer between 0 and 65,535, inclusive.

This field is incredibly rare and almost never needed except for compliance with
proprietary standards and software.

#### Inherited from

[ZipAttributes](ZipAttributes.md).[extra](ZipAttributes.md#extra)

___

### filename

• **filename**: `string`

The filename to associate with the data provided to this stream. If you
want a file in a subdirectory, use forward slashes as a separator (e.g.
`directory/filename.ext`). This will still work on Windows.

___

### flag

• `Optional` **flag**: `number`

Bits 1 and 2 of the general purpose bit flag, specified in PKZIP's
APPNOTE.txt, section 4.4.4. Should be between 0 and 3. This is unlikely
to be necessary.

___

### mtime

• `Optional` **mtime**: `string` \| `number` \| `Date`

When the file was last modified. Defaults to the current time.

#### Inherited from

[ZipAttributes](ZipAttributes.md).[mtime](ZipAttributes.md#mtime)

___

### ondata

• `Optional` **ondata**: [`AsyncFlateStreamHandler`](../README.md#asyncflatestreamhandler)

The handler to be called when data is added. After passing this stream to
the ZIP file object, this handler will always be defined. To call it:

`stream.ondata(error, chunk, final)`

error = any error that occurred (null if there was no error)

chunk = a Uint8Array of the data that was added (null if there was an
error)

final = boolean, whether this is the final chunk in the stream

___

### os

• `Optional` **os**: `number`

The operating system of origin for this file. The value is defined
by PKZIP's APPNOTE.txt, section 4.4.2.2. For example, 0 (the default)
is MS/DOS, 3 is Unix, 19 is macOS.

#### Inherited from

[ZipAttributes](ZipAttributes.md).[os](ZipAttributes.md#os)

___

### size

• **size**: `number`

The size of the file in bytes. This attribute may be invalid after
the file is added to the ZIP archive; it must be correct only before the
stream completes.

If you don't want to have to compute this yourself, consider extending the
ZipPassThrough class and overriding its process() method, or using one of
ZipDeflate or AsyncZipDeflate.

___

### terminate

• `Optional` **terminate**: [`AsyncTerminable`](AsyncTerminable.md)

A method called when the stream is no longer needed, for clean-up
purposes. This will not always be called after the stream completes,
so you may wish to call this.terminate() after the final chunk is
processed if you have clean-up logic.
