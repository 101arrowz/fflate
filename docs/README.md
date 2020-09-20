# fflate

## Index

### Interfaces

* [DeflateOptions](interfaces/deflateoptions.md)
* [GZIPOptions](interfaces/gzipoptions.md)
* [ZlibOptions](interfaces/zliboptions.md)

### Functions

* [decompress](README.md#decompress)
* [deflate](README.md#deflate)
* [gunzip](README.md#gunzip)
* [gzip](README.md#gzip)
* [inflate](README.md#inflate)
* [unzlib](README.md#unzlib)
* [zlib](README.md#zlib)

## Functions

### decompress

▸ **decompress**(`data`: Uint8Array, `out?`: Uint8Array): Uint8Array

*Defined in [index.ts:775](https://github.com/101arrowz/fflate/blob/fcabaac/src/index.ts#L775)*

Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`out?` | Uint8Array | Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length. |

**Returns:** Uint8Array

___

### deflate

▸ **deflate**(`data`: Uint8Array, `opts`: [DeflateOptions](interfaces/deflateoptions.md)): Uint8Array

*Defined in [index.ts:681](https://github.com/101arrowz/fflate/blob/fcabaac/src/index.ts#L681)*

Compresses data with DEFLATE without any wrapper

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | Uint8Array | - | The data to compress |
`opts` | [DeflateOptions](interfaces/deflateoptions.md) | {} | The compression options |

**Returns:** Uint8Array

___

### gunzip

▸ **gunzip**(`data`: Uint8Array, `out?`: Uint8Array): Uint8Array

*Defined in [index.ts:721](https://github.com/101arrowz/fflate/blob/fcabaac/src/index.ts#L721)*

Expands GZIP data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`out?` | Uint8Array | Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory. |

**Returns:** Uint8Array

___

### gzip

▸ **gzip**(`data`: Uint8Array, `opts`: [GZIPOptions](interfaces/gzipoptions.md)): Uint8Array

*Defined in [index.ts:701](https://github.com/101arrowz/fflate/blob/fcabaac/src/index.ts#L701)*

Compresses data with GZIP

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | Uint8Array | - | The data to compress |
`opts` | [GZIPOptions](interfaces/gzipoptions.md) | {} | The compression options |

**Returns:** Uint8Array

___

### inflate

▸ **inflate**(`data`: Uint8Array, `out?`: Uint8Array): Uint8Array

*Defined in [index.ts:691](https://github.com/101arrowz/fflate/blob/fcabaac/src/index.ts#L691)*

Expands DEFLATE data with no wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`out?` | Uint8Array | Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length. |

**Returns:** Uint8Array

___

### unzlib

▸ **unzlib**(`data`: Uint8Array, `out?`: Uint8Array): Uint8Array

*Defined in [index.ts:759](https://github.com/101arrowz/fflate/blob/fcabaac/src/index.ts#L759)*

Expands Zlib data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`out?` | Uint8Array | Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length. |

**Returns:** Uint8Array

___

### zlib

▸ **zlib**(`data`: Uint8Array, `opts`: [ZlibOptions](interfaces/zliboptions.md)): Uint8Array

*Defined in [index.ts:738](https://github.com/101arrowz/fflate/blob/fcabaac/src/index.ts#L738)*

Compress data with Zlib

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [ZlibOptions](interfaces/zliboptions.md) | The compression options |

**Returns:** Uint8Array
