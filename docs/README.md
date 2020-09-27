# fflate

## Index

### Interfaces

* [AsyncDeflateOptions](interfaces/asyncdeflateoptions.md)
* [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md)
* [AsyncGzipOptions](interfaces/asyncgzipoptions.md)
* [AsyncInflateOptions](interfaces/asyncinflateoptions.md)
* [AsyncUnzlibOptions](interfaces/asyncunzliboptions.md)
* [AsyncZlibOptions](interfaces/asynczliboptions.md)
* [DeflateOptions](interfaces/deflateoptions.md)
* [GzipOptions](interfaces/gzipoptions.md)
* [ZlibOptions](interfaces/zliboptions.md)

### Type aliases

* [FlateCallback](README.md#flatecallback)

### Functions

* [decompress](README.md#decompress)
* [decompressSync](README.md#decompresssync)
* [deflate](README.md#deflate)
* [deflateSync](README.md#deflatesync)
* [gunzip](README.md#gunzip)
* [gunzipSync](README.md#gunzipsync)
* [gzip](README.md#gzip)
* [gzipSync](README.md#gzipsync)
* [inflate](README.md#inflate)
* [inflateSync](README.md#inflatesync)
* [unzlib](README.md#unzlib)
* [unzlibSync](README.md#unzlibsync)
* [zlib](README.md#zlib)
* [zlibSync](README.md#zlibsync)

## Type aliases

### FlateCallback

Ƭ  **FlateCallback**: (err: Error,data: Uint8Array) => unknown

Callback for asynchronous comrpession methods

**`param`** Any error that occurred

**`param`** The resulting data. Only present if `err` is null

## Functions

### decompress

▸ **decompress**(`data`: Uint8Array, `opts`: [AsyncInflateOptions](interfaces/asyncinflateoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchrononously expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts` | [AsyncInflateOptions](interfaces/asyncinflateoptions.md) | The decompression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion  |

**Returns:** void

▸ **decompress**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchrononously expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion  |

**Returns:** void

___

### decompressSync

▸ **decompressSync**(`data`: Uint8Array, `out?`: Uint8Array): Uint8Array

Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`out?` | Uint8Array | Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length. |

**Returns:** Uint8Array

___

### deflate

▸ **deflate**(`data`: Uint8Array, `opts`: [AsyncDeflateOptions](interfaces/asyncdeflateoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously compresses data with DEFLATE without any wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [AsyncDeflateOptions](interfaces/asyncdeflateoptions.md) | The compression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** void

▸ **deflate**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously compresses data with DEFLATE without any wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** void

___

### deflateSync

▸ **deflateSync**(`data`: Uint8Array, `opts?`: [DeflateOptions](interfaces/deflateoptions.md)): Uint8Array

Compresses data with DEFLATE without any wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts?` | [DeflateOptions](interfaces/deflateoptions.md) | The compression options |

**Returns:** Uint8Array

___

### gunzip

▸ **gunzip**(`data`: Uint8Array, `opts`: [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously expands GZIP data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts` | [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md) | The decompression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion  |

**Returns:** void

▸ **gunzip**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously expands GZIP data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion  |

**Returns:** void

___

### gunzipSync

▸ **gunzipSync**(`data`: Uint8Array, `out?`: Uint8Array): Uint8Array

Expands GZIP data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`out?` | Uint8Array | Where to write the data. GZIP already encodes the output size, so providing this doesn't save memory. |

**Returns:** Uint8Array

___

### gzip

▸ **gzip**(`data`: Uint8Array, `opts`: [AsyncGzipOptions](interfaces/asyncgzipoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously compresses data with GZIP

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [AsyncGzipOptions](interfaces/asyncgzipoptions.md) | The compression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** void

▸ **gzip**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously compresses data with GZIP

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** void

▸ **gzip**(`data`: Uint8Array, `opts`: [AsyncGzipOptions](interfaces/asyncgzipoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously compresses data with GZIP

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [AsyncGzipOptions](interfaces/asyncgzipoptions.md) | The compression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** void

▸ **gzip**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously compresses data with GZIP

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** void

___

### gzipSync

▸ **gzipSync**(`data`: Uint8Array, `opts?`: [GzipOptions](interfaces/gzipoptions.md)): Uint8Array

Compresses data with GZIP

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts?` | [GzipOptions](interfaces/gzipoptions.md) | The compression options |

**Returns:** Uint8Array

___

### inflate

▸ **inflate**(`data`: Uint8Array, `opts`: [AsyncInflateOptions](interfaces/asyncinflateoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously expands DEFLATE data with no wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts` | [AsyncInflateOptions](interfaces/asyncinflateoptions.md) | The decompression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion  |

**Returns:** void

▸ **inflate**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously expands DEFLATE data with no wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion  |

**Returns:** void

___

### inflateSync

▸ **inflateSync**(`data`: Uint8Array, `out?`: Uint8Array): Uint8Array

Expands DEFLATE data with no wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`out?` | Uint8Array | Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length. |

**Returns:** Uint8Array

___

### unzlib

▸ **unzlib**(`data`: Uint8Array, `opts`: [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously expands Zlib data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts` | [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md) | The decompression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion  |

**Returns:** void

▸ **unzlib**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously expands Zlib data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion  |

**Returns:** void

___

### unzlibSync

▸ **unzlibSync**(`data`: Uint8Array, `out?`: Uint8Array): Uint8Array

Expands Zlib data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`out?` | Uint8Array | Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length. |

**Returns:** Uint8Array

___

### zlib

▸ **zlib**(`data`: Uint8Array, `opts`: [AsyncZlibOptions](interfaces/asynczliboptions.md), `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously compresses data with Zlib

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [AsyncZlibOptions](interfaces/asynczliboptions.md) | The compression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** void

▸ **zlib**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): void

Asynchronously compresses data with Zlib

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** void

___

### zlibSync

▸ **zlibSync**(`data`: Uint8Array, `opts?`: [ZlibOptions](interfaces/zliboptions.md)): Uint8Array

Compress data with Zlib

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts?` | [ZlibOptions](interfaces/zliboptions.md) | The compression options |

**Returns:** Uint8Array
