# Interface: ZipInputFile

A stream that can be used to create a file in a ZIP archive

## Hierarchy

* [ZipAttributes](zipattributes.md)

  ↳ **ZipInputFile**

## Implemented by

* [AsyncZipDeflate](../classes/asynczipdeflate.md)
* [ZipDeflate](../classes/zipdeflate.md)
* [ZipPassThrough](../classes/zippassthrough.md)

## Index

### Properties

* [attrs](zipinputfile.md#attrs)
* [compression](zipinputfile.md#compression)
* [crc](zipinputfile.md#crc)
* [filename](zipinputfile.md#filename)
* [flag](zipinputfile.md#flag)
* [mtime](zipinputfile.md#mtime)
* [ondata](zipinputfile.md#ondata)
* [os](zipinputfile.md#os)
* [size](zipinputfile.md#size)
* [terminate](zipinputfile.md#terminate)

## Properties

### attrs

• `Optional` **attrs**: number

*Inherited from [ZipAttributes](zipattributes.md).[attrs](zipattributes.md#attrs)*

The file's attributes. These are traditionally somewhat complicated
and platform-dependent, so using them is scarcely necessary. However,
here is a representation of what this is, bit by bit:

`TTTTugtrwxrwxrwx0000000000ADVSHR`

T = file type (rarely useful)

u = setuid, g = setgid, t = sticky

rwx = user permissions, rwx = group permissions, rwx = other permissions

0000000000 = unused

A = archive, D = directory, V = volume label, S = system file, H = hidden, R = read-only

If you want to set the Unix permissions, for instance, just bit shift by 16, e.g. 0644 << 16

___

### compression

• `Optional` **compression**: number

The compression format for the data stream. This number is determined by
the spec in PKZIP's APPNOTE.txt, section 4.4.5. For example, 0 = no
compression, 8 = deflate, 14 = LZMA

___

### crc

•  **crc**: number

A CRC of the original file contents. This attribute may be invalid after
the file is added to the ZIP archive; it must be correct only before the
stream completes.

If you don't want to have to generate this yourself, consider extending the
ZipPassThrough class and overriding its process() method, or using one of
ZipDeflate or AsyncZipDeflate

___

### filename

•  **filename**: string

The filename to associate with the data provided to this stream. If you
want a file in a subdirectory, use forward slashes as a separator (e.g.
`directory/filename.ext`). This will still work on Windows.

___

### flag

• `Optional` **flag**: 0 \| 1 \| 2 \| 3

Bits 1 and 2 of the general purpose bit flag, specified in PKZIP's
APPNOTE.txt, section 4.4.4. This is unlikely to be necessary.

___

### mtime

• `Optional` **mtime**: GzipOptions[\"mtime\"]

*Inherited from [ZipAttributes](zipattributes.md).[mtime](zipattributes.md#mtime)*

When the file was last modified. Defaults to the current time.

___

### ondata

• `Optional` **ondata**: [AsyncFlateStreamHandler](../README.md#asyncflatestreamhandler)

The handler to be called when data is added. After passing this stream to
the ZIP file object, this handler will always be defined. To call it:

`stream.ondata(error, chunk, final)`

error = any error that occurred (null if there was no error)

chunk = a Uint8Array of the data that was added (null if there was an
error)

final = boolean, whether this is the final chunk in the stream

___

### os

• `Optional` **os**: number

*Inherited from [ZipAttributes](zipattributes.md).[os](zipattributes.md#os)*

The operating system of origin for this file. The value is defined
by PKZIP's APPNOTE.txt, section 4.4.2.2. For example, 0 (the default)
is MS/DOS, 3 is UNIX, 19 is macOS.

___

### size

•  **size**: number

The size of the file in bytes. This attribute may be invalid after
the file is added to the ZIP archive; it must be correct only before the
stream completes.

If you don't want to have to compute this yourself, consider extending the
ZipPassThrough class and overriding its process() method, or using one of
ZipDeflate or AsyncZipDeflate

___

### terminate

• `Optional` **terminate**: [AsyncTerminable](asyncterminable.md)

A method called when the stream is no longer needed, for clean-up
purposes. This will not always be called after the stream completes,
so, you may wish to call this.terminate() after the final chunk is
processed if you have clean-up logic.
