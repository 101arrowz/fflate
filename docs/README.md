# fflate

## Index

### Classes

* [AsyncDecompress](classes/asyncdecompress.md)
* [AsyncDeflate](classes/asyncdeflate.md)
* [AsyncGunzip](classes/asyncgunzip.md)
* [AsyncGzip](classes/asyncgzip.md)
* [AsyncInflate](classes/asyncinflate.md)
* [AsyncUnzipInflate](classes/asyncunzipinflate.md)
* [AsyncUnzlib](classes/asyncunzlib.md)
* [AsyncZipDeflate](classes/asynczipdeflate.md)
* [AsyncZlib](classes/asynczlib.md)
* [DecodeUTF8](classes/decodeutf8.md)
* [Decompress](classes/decompress.md)
* [Deflate](classes/deflate.md)
* [EncodeUTF8](classes/encodeutf8.md)
* [Gunzip](classes/gunzip.md)
* [Gzip](classes/gzip.md)
* [Inflate](classes/inflate.md)
* [Unzip](classes/unzip.md)
* [UnzipInflate](classes/unzipinflate.md)
* [UnzipPassThrough](classes/unzippassthrough.md)
* [Unzlib](classes/unzlib.md)
* [Zip](classes/zip.md)
* [ZipDeflate](classes/zipdeflate.md)
* [ZipPassThrough](classes/zippassthrough.md)
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
* [FlateError](interfaces/flateerror.md)
* [GunzipOptions](interfaces/gunzipoptions.md)
* [GunzipStreamOptions](interfaces/gunzipstreamoptions.md)
* [GzipOptions](interfaces/gzipoptions.md)
* [InflateOptions](interfaces/inflateoptions.md)
* [InflateStreamOptions](interfaces/inflatestreamoptions.md)
* [UnzipDecoder](interfaces/unzipdecoder.md)
* [UnzipDecoderConstructor](interfaces/unzipdecoderconstructor.md)
* [UnzipFile](interfaces/unzipfile.md)
* [UnzipFileInfo](interfaces/unzipfileinfo.md)
* [UnzipOptions](interfaces/unzipoptions.md)
* [Unzipped](interfaces/unzipped.md)
* [UnzlibOptions](interfaces/unzliboptions.md)
* [UnzlibStreamOptions](interfaces/unzlibstreamoptions.md)
* [ZipAttributes](interfaces/zipattributes.md)
* [ZipInputFile](interfaces/zipinputfile.md)
* [ZipOptions](interfaces/zipoptions.md)
* [Zippable](interfaces/zippable.md)
* [ZlibOptions](interfaces/zliboptions.md)

### Type aliases

* [AsyncFlateStreamHandler](README.md#asyncflatestreamhandler)
* [AsyncZippableFile](README.md#asynczippablefile)
* [FlateCallback](README.md#flatecallback)
* [FlateStreamHandler](README.md#flatestreamhandler)
* [GunzipMemberHandler](README.md#gunzipmemberhandler)
* [StringStreamHandler](README.md#stringstreamhandler)
* [UnzipCallback](README.md#unzipcallback)
* [UnzipFileFilter](README.md#unzipfilefilter)
* [UnzipFileHandler](README.md#unzipfilehandler)
* [ZippableFile](README.md#zippablefile)

### Variables

* [FlateErrorCode](README.md#flateerrorcode)

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

Ƭ  **AsyncFlateStreamHandler**: (err: [FlateError](interfaces/flateerror.md) \| null,data: Uint8Array,final: boolean) => void

Handler for asynchronous data (de)compression streams

**`param`** Any error that occurred

**`param`** The data output from the stream processor

**`param`** Whether this is the final block

___

### AsyncZippableFile

Ƭ  **AsyncZippableFile**: Uint8Array \| [AsyncZippable](interfaces/asynczippable.md) \| []

A file that can be used to asynchronously create a ZIP archive

___

### FlateCallback

Ƭ  **FlateCallback**: (err: [FlateError](interfaces/flateerror.md) \| null,data: Uint8Array) => void

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

### GunzipMemberHandler

Ƭ  **GunzipMemberHandler**: (offset: number) => void

Handler for new GZIP members in concatenated GZIP streams. Useful for building indices used to perform random-access reads on compressed files.

**`param`** The offset of the new member relative to the start of the stream

___

### StringStreamHandler

Ƭ  **StringStreamHandler**: (data: string,final: boolean) => void

Handler for string generation streams

**`param`** The string output from the stream processor

**`param`** Whether this is the final block

___

### UnzipCallback

Ƭ  **UnzipCallback**: (err: [FlateError](interfaces/flateerror.md) \| null,data: [Unzipped](interfaces/unzipped.md)) => void

Callback for asynchronous ZIP decompression

**`param`** Any error that occurred

**`param`** The decompressed ZIP archive

___

### UnzipFileFilter

Ƭ  **UnzipFileFilter**: (file: [UnzipFileInfo](interfaces/unzipfileinfo.md)) => boolean

A filter for files to be extracted during the unzipping process

**`param`** The info for the current file being processed

**`returns`** Whether or not to extract the current file

___

### UnzipFileHandler

Ƭ  **UnzipFileHandler**: (file: [UnzipFile](interfaces/unzipfile.md)) => void

Handler for streaming ZIP decompression

**`param`** The file that was found in the archive

___

### ZippableFile

Ƭ  **ZippableFile**: Uint8Array \| [Zippable](interfaces/zippable.md) \| []

A file that can be used to create a ZIP archive

## Variables

### FlateErrorCode

• `Const` **FlateErrorCode**: object = { UnexpectedEOF: 0, InvalidBlockType: 1, InvalidLengthLiteral: 2, InvalidDistance: 3, StreamFinished: 4, NoStreamHandler: 5, InvalidHeader: 6, NoCallback: 7, InvalidUTF8: 8, ExtraFieldTooLong: 9, InvalidDate: 10, FilenameTooLong: 11, StreamFinishing: 12, InvalidZipData: 13, UnknownCompressionMethod: 14} as const

Codes for errors generated within this library

#### Type declaration:

Name | Type |
------ | ------ |
`ExtraFieldTooLong` | 9 |
`FilenameTooLong` | 11 |
`InvalidBlockType` | 1 |
`InvalidDate` | 10 |
`InvalidDistance` | 3 |
`InvalidHeader` | 6 |
`InvalidLengthLiteral` | 2 |
`InvalidUTF8` | 8 |
`InvalidZipData` | 13 |
`NoCallback` | 7 |
`NoStreamHandler` | 5 |
`StreamFinished` | 4 |
`StreamFinishing` | 12 |
`UnexpectedEOF` | 0 |
`UnknownCompressionMethod` | 14 |

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

▸ **decompressSync**(`data`: Uint8Array, `opts?`: [InflateOptions](interfaces/inflateoptions.md)): Uint8Array

Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts?` | [InflateOptions](interfaces/inflateoptions.md) | The decompression options |

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

▸ **gunzipSync**(`data`: Uint8Array, `opts?`: [GunzipOptions](interfaces/gunzipoptions.md)): Uint8Array

Expands GZIP data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts?` | [GunzipOptions](interfaces/gunzipoptions.md) | The decompression options |

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

▸ **inflateSync**(`data`: Uint8Array, `opts?`: [InflateOptions](interfaces/inflateoptions.md)): Uint8Array

Expands DEFLATE data with no wrapper

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts?` | [InflateOptions](interfaces/inflateoptions.md) | The decompression options |

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

▸ **unzip**(`data`: Uint8Array, `opts`: [AsyncUnzipOptions](interfaces/asyncunzipoptions.md), `cb`: [UnzipCallback](README.md#unzipcallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously decompresses a ZIP archive

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The raw compressed ZIP file |
`opts` | [AsyncUnzipOptions](interfaces/asyncunzipoptions.md) | The ZIP extraction options |
`cb` | [UnzipCallback](README.md#unzipcallback) | The callback to call with the decompressed files |

**Returns:** [AsyncTerminable](interfaces/asyncterminable.md)

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

▸ **unzipSync**(`data`: Uint8Array, `opts?`: [UnzipOptions](interfaces/unzipoptions.md)): [Unzipped](interfaces/unzipped.md)

Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
performance with more than one file.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The raw compressed ZIP file |
`opts?` | [UnzipOptions](interfaces/unzipoptions.md) | The ZIP extraction options |

**Returns:** [Unzipped](interfaces/unzipped.md)

___

### unzlib

▸ **unzlib**(`data`: Uint8Array, `opts`: [AsyncUnzlibOptions](interfaces/asyncunzliboptions.md), `cb`: [FlateCallback](README.md#flatecallback)): [AsyncTerminable](interfaces/asyncterminable.md)

Asynchronously expands Zlib data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts` | [AsyncUnzlibOptions](interfaces/asyncunzliboptions.md) | The decompression options |
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

▸ **unzlibSync**(`data`: Uint8Array, `opts?`: [UnzlibOptions](interfaces/unzliboptions.md)): Uint8Array

Expands Zlib data

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to decompress |
`opts?` | [UnzlibOptions](interfaces/unzliboptions.md) | The decompression options |

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

▸ **zipSync**(`data`: [Zippable](interfaces/zippable.md), `opts?`: [ZipOptions](interfaces/zipoptions.md)): Uint8Array

Synchronously creates a ZIP file. Prefer using `zip` for better performance
with more than one file.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | [Zippable](interfaces/zippable.md) | The directory structure for the ZIP archive |
`opts?` | [ZipOptions](interfaces/zipoptions.md) | The main options, merged with per-file options |

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

▸ **zlibSync**(`data`: Uint8Array, `opts?`: [ZlibOptions](interfaces/zliboptions.md)): Uint8Array

Compress data with Zlib

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | Uint8Array | The data to compress |
`opts?` | [ZlibOptions](interfaces/zliboptions.md) | The compression options |

**Returns:** Uint8Array
