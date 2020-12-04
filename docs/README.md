# fflate

## Index

### Classes

* [AsyncDecompress](classes/asyncdecompress.md)
* [AsyncDeflate](classes/asyncdeflate.md)
* [AsyncGunzip](classes/asyncgunzip.md)
* [AsyncGzip](classes/asyncgzip.md)
* [AsyncInflate](classes/asyncinflate.md)
* [AsyncUnzlib](classes/asyncunzlib.md)
* [AsyncZlib](classes/asynczlib.md)
* [Decompress](classes/decompress.md)
* [Deflate](classes/deflate.md)
* [Gunzip](classes/gunzip.md)
* [Gzip](classes/gzip.md)
* [Inflate](classes/inflate.md)
* [Unzlib](classes/unzlib.md)
* [Zlib](classes/zlib.md)

### Interfaces

* [AsyncDeflateOptions](interfaces/asyncdeflateoptions.md)
* [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md)
* [AsyncGzipOptions](interfaces/asyncgzipoptions.md)
* [AsyncInflateOptions](interfaces/asyncinflateoptions.md)
* [AsyncTerminable](interfaces/asyncterminable.md)
* [AsyncUnzipOptions](interfaces/asyncunzipoptions.md)
* [AsyncUnzlibOptions](interfaces/asyncunzliboptions.md)
* [AsyncZipOptions](interfaces/asynczipoptions.md)
* [AsyncZippable](interfaces/asynczippable.md)
* [AsyncZlibOptions](interfaces/asynczliboptions.md)
* [DeflateOptions](interfaces/deflateoptions.md)
* [GzipOptions](interfaces/gzipoptions.md)
* [Unzipped](interfaces/unzipped.md)
* [ZipOptions](interfaces/zipoptions.md)
* [Zippable](interfaces/zippable.md)
* [ZlibOptions](interfaces/zliboptions.md)

### Type aliases

* [AsyncFlateStreamHandler](README.md#asyncflatestreamhandler)
* [AsyncZippableFile](README.md#asynczippablefile)
* [FlateCallback](README.md#flatecallback)
* [FlateStreamHandler](README.md#flatestreamhandler)
* [UnzipCallback](README.md#unzipcallback)
* [ZippableFile](README.md#zippablefile)

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
* [strFromU8](README.md#strfromu8)
* [strToU8](README.md#strtou8)
* [unzip](README.md#unzip)
* [unzipSync](README.md#unzipsync)
* [unzlib](README.md#unzlib)
* [unzlibSync](README.md#unzlibsync)
* [zip](README.md#zip)
* [zipSync](README.md#zipsync)
* [zlib](README.md#zlib)
* [zlibSync](README.md#zlibsync)

## Type aliases

### AsyncFlateStreamHandler

Ƭ  **AsyncFlateStreamHandler**: (err: Error,data: Uint8Array,final: boolean) => void

Handler for asynchronous data (de)compression streams

**`param`** Any error that occurred

**`param`** The data output from the stream processor

**`param`** Whether this is the final block

___

### AsyncZippableFile

Ƭ  **AsyncZippableFile**: Uint8Array \| []

A file that can be used to asynchronously create a ZIP archive

___

### FlateCallback

Ƭ  **FlateCallback**: (err: Error \| string,data: Uint8Array) => void

Callback for asynchronous (de)compression methods

**`param`** Any error that occurred

**`param`** The resulting data. Only present if `err` is null

___

### FlateStreamHandler

Ƭ  **FlateStreamHandler**: (data: Uint8Array,final: boolean) => void

Handler for data (de)compression streams

**`param`** The data output from the stream processor

**`param`** Whether this is the final block

___

### UnzipCallback

Ƭ  **UnzipCallback**: (err: Error \| string,data: [Unzipped](interfaces/unzipped.md)) => void

Callback for asynchronous ZIP decompression

**`param`** Any error that occurred

**`param`** The decompressed ZIP archive

___

### ZippableFile

Ƭ  **ZippableFile**: Uint8Array \| []

A file that can be used to create a ZIP archive

## Functions

### decompress

▸ **decompress**(`data`: Uint8Array, `opts`: [AsyncInflateOptions](interfaces/asyncinflateoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchrononously expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts` | [AsyncInflateOptions](interfaces/asyncinflateoptions.md) | The decompression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **decompress**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchrononously expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

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

▸ **deflate**(`data`: Uint8Array, `opts`: [AsyncDeflateOptions](interfaces/asyncdeflateoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously compresses data with DEFLATE without any wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [AsyncDeflateOptions](interfaces/asyncdeflateoptions.md) | The compression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **deflate**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously compresses data with DEFLATE without any wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

___

### deflateSync

▸ **deflateSync**(`data`: Uint8Array, `opts`: [DeflateOptions](interfaces/deflateoptions.md)): Uint8Array

Compresses data with DEFLATE without any wrapper

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | Uint8Array | - | The data to compress |
`opts` | [DeflateOptions](interfaces/deflateoptions.md) | {} | The compression options |

**Returns:** Uint8Array

___

### gunzip

▸ **gunzip**(`data`: Uint8Array, `opts`: [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously expands GZIP data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts` | [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md) | The decompression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **gunzip**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously expands GZIP data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

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

▸ **gzip**(`data`: Uint8Array, `opts`: [AsyncGzipOptions](interfaces/asyncgzipoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously compresses data with GZIP

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [AsyncGzipOptions](interfaces/asyncgzipoptions.md) | The compression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **gzip**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously compresses data with GZIP

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **gzip**(`data`: Uint8Array, `opts`: [AsyncGzipOptions](interfaces/asyncgzipoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously compresses data with GZIP

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [AsyncGzipOptions](interfaces/asyncgzipoptions.md) | The compression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **gzip**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously compresses data with GZIP

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

___

### gzipSync

▸ **gzipSync**(`data`: Uint8Array, `opts`: [GzipOptions](interfaces/gzipoptions.md)): Uint8Array

Compresses data with GZIP

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | Uint8Array | - | The data to compress |
`opts` | [GzipOptions](interfaces/gzipoptions.md) | {} | The compression options |

**Returns:** Uint8Array

___

### inflate

▸ **inflate**(`data`: Uint8Array, `opts`: [AsyncInflateOptions](interfaces/asyncinflateoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously expands DEFLATE data with no wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts` | [AsyncInflateOptions](interfaces/asyncinflateoptions.md) | The decompression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **inflate**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously expands DEFLATE data with no wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

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

### strFromU8

▸ **strFromU8**(`dat`: Uint8Array, `latin1?`: boolean): string

Converts a Uint8Array to a string

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`dat` | Uint8Array | The data to decode to string |
`latin1?` | boolean | Whether or not to interpret the data as Latin-1. This should               not need to be true unless encoding to binary string. |

**Returns:** string

___

### strToU8

▸ **strToU8**(`str`: string, `latin1?`: boolean): Uint8Array

Converts a string into a Uint8Array for use with compression/decompression methods

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`str` | string | The string to encode |
`latin1?` | boolean | Whether or not to interpret the data as Latin-1. This should               not need to be true unless decoding a binary string. |

**Returns:** Uint8Array

___

### unzip

▸ **unzip**(`data`: Uint8Array, `cb`: [UnzipCallback](README.md#unzipcallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously decompresses a ZIP archive

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The raw compressed ZIP file |
`cb` | [UnzipCallback](README.md#unzipcallback) | The callback to call with the decompressed files |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

___

### unzipSync

▸ **unzipSync**(`data`: Uint8Array): [Unzipped](interfaces/unzipped.md)

Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
performance with more than one file.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The raw compressed ZIP file |

**Returns:** [Unzipped](interfaces/unzipped.md)

___

### unzlib

▸ **unzlib**(`data`: Uint8Array, `opts`: [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously expands Zlib data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts` | [AsyncGunzipOptions](interfaces/asyncgunzipoptions.md) | The decompression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **unzlib**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously expands Zlib data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon decompression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

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

### zip

▸ **zip**(`data`: [AsyncZippable](interfaces/asynczippable.md), `opts`: [AsyncZipOptions](interfaces/asynczipoptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously creates a ZIP file

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | [AsyncZippable](interfaces/asynczippable.md) | The directory structure for the ZIP archive |
`opts` | [AsyncZipOptions](interfaces/asynczipoptions.md) | The main options, merged with per-file options |
`cb` | [FlateCallback](README.md#flatecallback) | The callback to call with the generated ZIP archive |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **zip**(`data`: [AsyncZippable](interfaces/asynczippable.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously creates a ZIP file

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | [AsyncZippable](interfaces/asynczippable.md) | The directory structure for the ZIP archive |
`cb` | [FlateCallback](README.md#flatecallback) | The callback to call with the generated ZIP archive |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

___

### zipSync

▸ **zipSync**(`data`: [Zippable](interfaces/zippable.md), `opts`: [ZipOptions](interfaces/zipoptions.md)): Uint8Array

Synchronously creates a ZIP file. Prefer using `zip` for better performance
with more than one file.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | [Zippable](interfaces/zippable.md) | - | The directory structure for the ZIP archive |
`opts` | [ZipOptions](interfaces/zipoptions.md) | {} | The main options, merged with per-file options |

**Returns:** Uint8Array

___

### zlib

▸ **zlib**(`data`: Uint8Array, `opts`: [AsyncZlibOptions](interfaces/asynczliboptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously compresses data with Zlib

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts` | [AsyncZlibOptions](interfaces/asynczliboptions.md) | The compression options |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion  |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

▸ **zlib**(`data`: Uint8Array, `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously compresses data with Zlib

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`cb` | [FlateCallback](README.md#flatecallback) | The function to be called upon compression completion |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

___

### zlibSync

▸ **zlibSync**(`data`: Uint8Array, `opts`: [ZlibOptions](interfaces/zliboptions.md)): Uint8Array

Compress data with Zlib

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | Uint8Array | - | The data to compress |
`opts` | [ZlibOptions](interfaces/zliboptions.md) | {} | The compression options |

**Returns:** Uint8Array
