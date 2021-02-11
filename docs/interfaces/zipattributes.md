# Interface: ZipAttributes

Attributes for files added to a ZIP archive object

## Hierarchy

* **ZipAttributes**

  ↳ [ZipOptions](zipoptions.md)

  ↳ [AsyncZipOptions](asynczipoptions.md)

  ↳ [ZipInputFile](zipinputfile.md)

## Index

### Properties

* [attrs](zipattributes.md#attrs)
* [comment](zipattributes.md#comment)
* [extra](zipattributes.md#extra)
* [mtime](zipattributes.md#mtime)
* [os](zipattributes.md#os)

## Properties

### attrs

• `Optional` **attrs**: number

The file's attributes. These are traditionally somewhat complicated
and platform-dependent, so using them is scarcely necessary. However,
here is a representation of what this is, bit by bit:

`TTTTugtrwxrwxrwx0000000000ADVSHR`

TTTT = file type (rarely useful)

u = setuid, g = setgid, t = sticky

rwx = user permissions, rwx = group permissions, rwx = other permissions

0000000000 = unused

A = archive, D = directory, V = volume label, S = system file, H = hidden, R = read-only

If you want to set the Unix permissions, for instance, just bit shift by 16, e.g. 0644 << 16

___

### comment

• `Optional` **comment**: string

The comment to attach to the file. This field is defined by PKZIP's APPNOTE.txt,
section 4.4.26. The comment must be at most 65,535 bytes long UTF-8 encoded. This
field is not read by consumer software.

___

### extra

• `Optional` **extra**: Record\<number, Uint8Array>

Extra metadata to add to the file. This field is defined by PKZIP's APPNOTE.txt,
section 4.4.28. At most 65,535 bytes may be used in each ID. The ID must be an
integer between 0 and 65,535, inclusive.

This field is incredibly rare and almost never needed except for compliance with
proprietary standards and software.

___

### mtime

• `Optional` **mtime**: GzipOptions[\"mtime\"]

When the file was last modified. Defaults to the current time.

___

### os

• `Optional` **os**: number

The operating system of origin for this file. The value is defined
by PKZIP's APPNOTE.txt, section 4.4.2.2. For example, 0 (the default)
is MS/DOS, 3 is UNIX, 19 is macOS.
