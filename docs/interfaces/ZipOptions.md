# Interface: ZipOptions

Options for creating a ZIP archive

## Hierarchy

- [`DeflateOptions`](DeflateOptions.md)

- [`ZipAttributes`](ZipAttributes.md)

  ↳ **`ZipOptions`**

## Table of contents

### Properties

- [attrs](ZipOptions.md#attrs)
- [comment](ZipOptions.md#comment)
- [dictionary](ZipOptions.md#dictionary)
- [extra](ZipOptions.md#extra)
- [level](ZipOptions.md#level)
- [mem](ZipOptions.md#mem)
- [mtime](ZipOptions.md#mtime)
- [os](ZipOptions.md#os)

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

### dictionary

• `Optional` **dictionary**: `Uint8Array`

A buffer containing common byte sequences in the input data that can be used to significantly improve compression ratios.

Dictionaries should be 32kB or smaller and include strings or byte sequences likely to appear in the input.
The decompressor must supply the same dictionary as the compressor to extract the original data.

Dictionaries only improve aggregate compression ratio when reused across multiple small inputs. They should typically not be used otherwise.

Avoid using dictionaries with GZIP and ZIP to maximize software compatibility.

#### Inherited from

[DeflateOptions](DeflateOptions.md).[dictionary](DeflateOptions.md#dictionary)

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

### level

• `Optional` **level**: ``0`` \| ``2`` \| ``1`` \| ``3`` \| ``4`` \| ``8`` \| ``5`` \| ``6`` \| ``7`` \| ``9``

The level of compression to use, ranging from 0-9.

0 will store the data without compression.
1 is fastest but compresses the worst, 9 is slowest but compresses the best.
The default level is 6.

Typically, binary data benefits much more from higher values than text data.
In both cases, higher values usually take disproportionately longer than the reduction in final size that results.

For example, a 1 MB text file could:
- become 1.01 MB with level 0 in 1ms
- become 400 kB with level 1 in 10ms
- become 320 kB with level 9 in 100ms

#### Inherited from

[DeflateOptions](DeflateOptions.md).[level](DeflateOptions.md#level)

___

### mem

• `Optional` **mem**: ``0`` \| ``2`` \| ``1`` \| ``3`` \| ``4`` \| ``8`` \| ``5`` \| ``6`` \| ``10`` \| ``7`` \| ``12`` \| ``9`` \| ``11``

The memory level to use, ranging from 0-12. Increasing this increases speed and compression ratio at the cost of memory.

Note that this is exponential: while level 0 uses 4 kB, level 4 uses 64 kB, level 8 uses 1 MB, and level 12 uses 16 MB.
It is recommended not to lower the value below 4, since that tends to hurt performance.
In addition, values above 8 tend to help very little on most data and can even hurt performance.

The default value is automatically determined based on the size of the input data.

#### Inherited from

[DeflateOptions](DeflateOptions.md).[mem](DeflateOptions.md#mem)

___

### mtime

• `Optional` **mtime**: `string` \| `number` \| `Date`

When the file was last modified. Defaults to the current time.

#### Inherited from

[ZipAttributes](ZipAttributes.md).[mtime](ZipAttributes.md#mtime)

___

### os

• `Optional` **os**: `number`

The operating system of origin for this file. The value is defined
by PKZIP's APPNOTE.txt, section 4.4.2.2. For example, 0 (the default)
is MS/DOS, 3 is Unix, 19 is macOS.

#### Inherited from

[ZipAttributes](ZipAttributes.md).[os](ZipAttributes.md#os)
