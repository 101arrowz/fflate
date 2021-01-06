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
* [mtime](zipattributes.md#mtime)
* [os](zipattributes.md#os)

## Properties

### attrs

• `Optional` **attrs**: number

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

### mtime

• `Optional` **mtime**: GzipOptions[\"mtime\"]

When the file was last modified. Defaults to the current time.

___

### os

• `Optional` **os**: number

The operating system of origin for this file. The value is defined
by PKZIP's APPNOTE.txt, section 4.4.2.2. For example, 0 (the default)
is MS/DOS, 3 is UNIX, 19 is macOS.
