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

*Defined in [index.ts:774](https://github.com/101arrowz/fflate/blob/fe2a3b1/src/index.ts#L774)*

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

*Defined in [index.ts:680](https://github.com/101arrowz/fflate/blob/fe2a3b1/src/index.ts#L680)*

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

*Defined in [index.ts:720](https://github.com/101arrowz/fflate/blob/fe2a3b1/src/index.ts#L720)*

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

*Defined in [index.ts:700](https://github.com/101arrowz/fflate/blob/fe2a3b1/src/index.ts#L700)*

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

*Defined in [index.ts:690](https://github.com/101arrowz/fflate/blob/fe2a3b1/src/index.ts#L690)*

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

*Defined in [index.ts:758](https://github.com/101arrowz/fflate/blob/fe2a3b1/src/index.ts#L758)*

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

*Defined in [index.ts:737](https://github.com/101arrowz/fflate/blob/fe2a3b1/src/index.ts#L737)*

Compress data with Zlib

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [ZlibOptions](interfaces/zliboptions.md) | The compression options |

**Returns:** Uint8Array
