# fflate

## Table of contents

### References

- [AsyncCompress](README.md#asynccompress)
- [Compress](README.md#compress)
- [compress](README.md#compress-1)
- [compressSync](README.md#compresssync)

### Classes

- [AsyncDecompress](classes/AsyncDecompress.md)
- [AsyncDeflate](classes/AsyncDeflate.md)
- [AsyncGunzip](classes/AsyncGunzip.md)
- [AsyncGzip](classes/AsyncGzip.md)
- [AsyncInflate](classes/AsyncInflate.md)
- [AsyncUnzipInflate](classes/AsyncUnzipInflate.md)
- [AsyncUnzlib](classes/AsyncUnzlib.md)
- [AsyncZipDeflate](classes/AsyncZipDeflate.md)
- [AsyncZlib](classes/AsyncZlib.md)
- [DecodeUTF8](classes/DecodeUTF8.md)
- [Decompress](classes/Decompress.md)
- [Deflate](classes/Deflate.md)
- [EncodeUTF8](classes/EncodeUTF8.md)
- [Gunzip](classes/Gunzip.md)
- [Gzip](classes/Gzip.md)
- [Inflate](classes/Inflate.md)
- [Unzip](classes/Unzip.md)
- [UnzipInflate](classes/UnzipInflate.md)
- [UnzipPassThrough](classes/UnzipPassThrough.md)
- [Unzlib](classes/Unzlib.md)
- [Zip](classes/Zip.md)
- [ZipDeflate](classes/ZipDeflate.md)
- [ZipPassThrough](classes/ZipPassThrough.md)
- [Zlib](classes/Zlib.md)

### Interfaces

- [AsyncDeflateOptions](interfaces/AsyncDeflateOptions.md)
- [AsyncGunzipOptions](interfaces/AsyncGunzipOptions.md)
- [AsyncGzipOptions](interfaces/AsyncGzipOptions.md)
- [AsyncInflateOptions](interfaces/AsyncInflateOptions.md)
- [AsyncTerminable](interfaces/AsyncTerminable.md)
- [AsyncUnzipOptions](interfaces/AsyncUnzipOptions.md)
- [AsyncUnzlibOptions](interfaces/AsyncUnzlibOptions.md)
- [AsyncZipOptions](interfaces/AsyncZipOptions.md)
- [AsyncZippable](interfaces/AsyncZippable.md)
- [AsyncZlibOptions](interfaces/AsyncZlibOptions.md)
- [DeflateOptions](interfaces/DeflateOptions.md)
- [FlateError](interfaces/FlateError.md)
- [GunzipOptions](interfaces/GunzipOptions.md)
- [GunzipStreamOptions](interfaces/GunzipStreamOptions.md)
- [GzipOptions](interfaces/GzipOptions.md)
- [InflateOptions](interfaces/InflateOptions.md)
- [InflateStreamOptions](interfaces/InflateStreamOptions.md)
- [UnzipDecoder](interfaces/UnzipDecoder.md)
- [UnzipDecoderConstructor](interfaces/UnzipDecoderConstructor.md)
- [UnzipFile](interfaces/UnzipFile.md)
- [UnzipFileInfo](interfaces/UnzipFileInfo.md)
- [UnzipOptions](interfaces/UnzipOptions.md)
- [Unzipped](interfaces/Unzipped.md)
- [UnzlibOptions](interfaces/UnzlibOptions.md)
- [UnzlibStreamOptions](interfaces/UnzlibStreamOptions.md)
- [ZipAttributes](interfaces/ZipAttributes.md)
- [ZipInputFile](interfaces/ZipInputFile.md)
- [ZipOptions](interfaces/ZipOptions.md)
- [Zippable](interfaces/Zippable.md)
- [ZlibOptions](interfaces/ZlibOptions.md)

### Type Aliases

- [AsyncFlateDrainHandler](README.md#asyncflatedrainhandler)
- [AsyncFlateStreamHandler](README.md#asyncflatestreamhandler)
- [AsyncZippableFile](README.md#asynczippablefile)
- [FlateCallback](README.md#flatecallback)
- [FlateStreamHandler](README.md#flatestreamhandler)
- [GunzipMemberHandler](README.md#gunzipmemberhandler)
- [StringStreamHandler](README.md#stringstreamhandler)
- [UnzipCallback](README.md#unzipcallback)
- [UnzipFileFilter](README.md#unzipfilefilter)
- [UnzipFileHandler](README.md#unzipfilehandler)
- [ZippableFile](README.md#zippablefile)

### Variables

- [FlateErrorCode](README.md#flateerrorcode)

### Functions

- [decompress](README.md#decompress)
- [decompressSync](README.md#decompresssync)
- [deflate](README.md#deflate)
- [deflateSync](README.md#deflatesync)
- [gunzip](README.md#gunzip)
- [gunzipSync](README.md#gunzipsync)
- [gzip](README.md#gzip)
- [gzipSync](README.md#gzipsync)
- [inflate](README.md#inflate)
- [inflateSync](README.md#inflatesync)
- [strFromU8](README.md#strfromu8)
- [strToU8](README.md#strtou8)
- [unzip](README.md#unzip)
- [unzipSync](README.md#unzipsync)
- [unzlib](README.md#unzlib)
- [unzlibSync](README.md#unzlibsync)
- [zip](README.md#zip)
- [zipSync](README.md#zipsync)
- [zlib](README.md#zlib)
- [zlibSync](README.md#zlibsync)

## References

### AsyncCompress

Renames and re-exports [AsyncGzip](classes/AsyncGzip.md)

___

### Compress

Renames and re-exports [Gzip](classes/Gzip.md)

___

### compress

Renames and re-exports [gzip](README.md#gzip)

___

### compressSync

Renames and re-exports [gzipSync](README.md#gzipsync)

## Type Aliases

### AsyncFlateDrainHandler

Ƭ **AsyncFlateDrainHandler**: (`size`: `number`) => `void`

#### Type declaration

▸ (`size`): `void`

Handler for the asynchronous completion of (de)compression for a data chunk

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | The number of bytes that were processed. This is measured in terms of the input (i.e. compressed bytes for decompression, uncompressed bytes for compression.) |

##### Returns

`void`

___

### AsyncFlateStreamHandler

Ƭ **AsyncFlateStreamHandler**: (`err`: [`FlateError`](interfaces/FlateError.md) \| ``null``, `data`: `Uint8Array`, `final`: `boolean`) => `void`

#### Type declaration

▸ (`err`, `data`, `final`): `void`

Handler for asynchronous data (de)compression streams

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `err` | [`FlateError`](interfaces/FlateError.md) \| ``null`` | Any error that occurred |
| `data` | `Uint8Array` | The data output from the stream processor |
| `final` | `boolean` | Whether this is the final block |

##### Returns

`void`

___

### AsyncZippableFile

Ƭ **AsyncZippableFile**: `Uint8Array` \| [`AsyncZippable`](interfaces/AsyncZippable.md) \| [`Uint8Array` \| [`AsyncZippable`](interfaces/AsyncZippable.md), [`AsyncZipOptions`](interfaces/AsyncZipOptions.md)]

A file that can be used to asynchronously create a ZIP archive

___

### FlateCallback

Ƭ **FlateCallback**: (`err`: [`FlateError`](interfaces/FlateError.md) \| ``null``, `data`: `Uint8Array`) => `void`

#### Type declaration

▸ (`err`, `data`): `void`

Callback for asynchronous (de)compression methods

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `err` | [`FlateError`](interfaces/FlateError.md) \| ``null`` | Any error that occurred |
| `data` | `Uint8Array` | The resulting data. Only present if `err` is null |

##### Returns

`void`

___

### FlateStreamHandler

Ƭ **FlateStreamHandler**: (`data`: `Uint8Array`, `final`: `boolean`) => `void`

#### Type declaration

▸ (`data`, `final`): `void`

Handler for data (de)compression streams

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data output from the stream processor |
| `final` | `boolean` | Whether this is the final block |

##### Returns

`void`

___

### GunzipMemberHandler

Ƭ **GunzipMemberHandler**: (`offset`: `number`) => `void`

#### Type declaration

▸ (`offset`): `void`

Handler for new GZIP members in concatenated GZIP streams. Useful for building indices used to perform random-access reads on compressed files.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `offset` | `number` | The offset of the new member relative to the start of the stream |

##### Returns

`void`

___

### StringStreamHandler

Ƭ **StringStreamHandler**: (`data`: `string`, `final`: `boolean`) => `void`

#### Type declaration

▸ (`data`, `final`): `void`

Handler for string generation streams

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `string` | The string output from the stream processor |
| `final` | `boolean` | Whether this is the final block |

##### Returns

`void`

___

### UnzipCallback

Ƭ **UnzipCallback**: (`err`: [`FlateError`](interfaces/FlateError.md) \| ``null``, `data`: [`Unzipped`](interfaces/Unzipped.md)) => `void`

#### Type declaration

▸ (`err`, `data`): `void`

Callback for asynchronous ZIP decompression

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `err` | [`FlateError`](interfaces/FlateError.md) \| ``null`` | Any error that occurred |
| `data` | [`Unzipped`](interfaces/Unzipped.md) | The decompressed ZIP archive |

##### Returns

`void`

___

### UnzipFileFilter

Ƭ **UnzipFileFilter**: (`file`: [`UnzipFileInfo`](interfaces/UnzipFileInfo.md)) => `boolean`

#### Type declaration

▸ (`file`): `boolean`

A filter for files to be extracted during the unzipping process

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `file` | [`UnzipFileInfo`](interfaces/UnzipFileInfo.md) | The info for the current file being processed |

##### Returns

`boolean`

Whether or not to extract the current file

___

### UnzipFileHandler

Ƭ **UnzipFileHandler**: (`file`: [`UnzipFile`](interfaces/UnzipFile.md)) => `void`

#### Type declaration

▸ (`file`): `void`

Handler for streaming ZIP decompression

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `file` | [`UnzipFile`](interfaces/UnzipFile.md) | The file that was found in the archive |

##### Returns

`void`

___

### ZippableFile

Ƭ **ZippableFile**: `Uint8Array` \| [`Zippable`](interfaces/Zippable.md) \| [`Uint8Array` \| [`Zippable`](interfaces/Zippable.md), [`ZipOptions`](interfaces/ZipOptions.md)]

A file that can be used to create a ZIP archive

## Variables

### FlateErrorCode

• `Const` **FlateErrorCode**: `Object`

Codes for errors generated within this library

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ExtraFieldTooLong` | ``9`` |
| `FilenameTooLong` | ``11`` |
| `InvalidBlockType` | ``1`` |
| `InvalidDate` | ``10`` |
| `InvalidDistance` | ``3`` |
| `InvalidHeader` | ``6`` |
| `InvalidLengthLiteral` | ``2`` |
| `InvalidUTF8` | ``8`` |
| `InvalidZipData` | ``13`` |
| `NoCallback` | ``7`` |
| `NoStreamHandler` | ``5`` |
| `StreamFinished` | ``4`` |
| `StreamFinishing` | ``12`` |
| `UnexpectedEOF` | ``0`` |
| `UnknownCompressionMethod` | ``14`` |

## Functions

### decompress

▸ **decompress**(`data`, `opts`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchrononously expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `opts` | [`AsyncInflateOptions`](interfaces/AsyncInflateOptions.md) | The decompression options |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon decompression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the decompression

▸ **decompress**(`data`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchrononously expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon decompression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the decompression

___

### decompressSync

▸ **decompressSync**(`data`, `opts?`): `Uint8Array`

Expands compressed GZIP, Zlib, or raw DEFLATE data, automatically detecting the format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `opts?` | [`InflateOptions`](interfaces/InflateOptions.md) | The decompression options |

#### Returns

`Uint8Array`

The decompressed version of the data

___

### deflate

▸ **deflate**(`data`, `opts`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously compresses data with DEFLATE without any wrapper

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to compress |
| `opts` | [`AsyncDeflateOptions`](interfaces/AsyncDeflateOptions.md) | The compression options |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon compression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the compression

▸ **deflate**(`data`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously compresses data with DEFLATE without any wrapper

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to compress |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon compression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

___

### deflateSync

▸ **deflateSync**(`data`, `opts?`): `Uint8Array`

Compresses data with DEFLATE without any wrapper

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to compress |
| `opts?` | [`DeflateOptions`](interfaces/DeflateOptions.md) | The compression options |

#### Returns

`Uint8Array`

The deflated version of the data

___

### gunzip

▸ **gunzip**(`data`, `opts`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously expands GZIP data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `opts` | [`AsyncGunzipOptions`](interfaces/AsyncGunzipOptions.md) | The decompression options |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon decompression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the decompression

▸ **gunzip**(`data`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously expands GZIP data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon decompression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the decompression

___

### gunzipSync

▸ **gunzipSync**(`data`, `opts?`): `Uint8Array`

Expands GZIP data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `opts?` | [`GunzipOptions`](interfaces/GunzipOptions.md) | The decompression options |

#### Returns

`Uint8Array`

The decompressed version of the data

___

### gzip

▸ **gzip**(`data`, `opts`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously compresses data with GZIP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to compress |
| `opts` | [`AsyncGzipOptions`](interfaces/AsyncGzipOptions.md) | The compression options |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon compression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the compression

▸ **gzip**(`data`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously compresses data with GZIP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to compress |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon compression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the decompression

___

### gzipSync

▸ **gzipSync**(`data`, `opts?`): `Uint8Array`

Compresses data with GZIP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to compress |
| `opts?` | [`GzipOptions`](interfaces/GzipOptions.md) | The compression options |

#### Returns

`Uint8Array`

The gzipped version of the data

___

### inflate

▸ **inflate**(`data`, `opts`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously expands DEFLATE data with no wrapper

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `opts` | [`AsyncInflateOptions`](interfaces/AsyncInflateOptions.md) | The decompression options |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon decompression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the decompression

▸ **inflate**(`data`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously expands DEFLATE data with no wrapper

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon decompression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the decompression

___

### inflateSync

▸ **inflateSync**(`data`, `opts?`): `Uint8Array`

Expands DEFLATE data with no wrapper

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `opts?` | [`InflateOptions`](interfaces/InflateOptions.md) | The decompression options |

#### Returns

`Uint8Array`

The decompressed version of the data

___

### strFromU8

▸ **strFromU8**(`dat`, `latin1?`): `string`

Converts a Uint8Array to a string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dat` | `Uint8Array` | The data to decode to string |
| `latin1?` | `boolean` | Whether or not to interpret the data as Latin-1. This should not need to be true unless encoding to binary string. |

#### Returns

`string`

The original UTF-8/Latin-1 string

___

### strToU8

▸ **strToU8**(`str`, `latin1?`): `Uint8Array`

Converts a string into a Uint8Array for use with compression/decompression methods

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | The string to encode |
| `latin1?` | `boolean` | Whether or not to interpret the data as Latin-1. This should not need to be true unless decoding a binary string. |

#### Returns

`Uint8Array`

The string encoded in UTF-8/Latin-1 binary

___

### unzip

▸ **unzip**(`data`, `opts`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously decompresses a ZIP archive

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The raw compressed ZIP file |
| `opts` | [`AsyncUnzipOptions`](interfaces/AsyncUnzipOptions.md) | The ZIP extraction options |
| `cb` | [`UnzipCallback`](README.md#unzipcallback) | The callback to call with the decompressed files |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the unzipping

▸ **unzip**(`data`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously decompresses a ZIP archive

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The raw compressed ZIP file |
| `cb` | [`UnzipCallback`](README.md#unzipcallback) | The callback to call with the decompressed files |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the unzipping

___

### unzipSync

▸ **unzipSync**(`data`, `opts?`): [`Unzipped`](interfaces/Unzipped.md)

Synchronously decompresses a ZIP archive. Prefer using `unzip` for better
performance with more than one file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The raw compressed ZIP file |
| `opts?` | [`UnzipOptions`](interfaces/UnzipOptions.md) | The ZIP extraction options |

#### Returns

[`Unzipped`](interfaces/Unzipped.md)

The decompressed files

___

### unzlib

▸ **unzlib**(`data`, `opts`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously expands Zlib data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `opts` | [`AsyncUnzlibOptions`](interfaces/AsyncUnzlibOptions.md) | The decompression options |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon decompression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the decompression

▸ **unzlib**(`data`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously expands Zlib data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon decompression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the decompression

___

### unzlibSync

▸ **unzlibSync**(`data`, `opts?`): `Uint8Array`

Expands Zlib data

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to decompress |
| `opts?` | [`UnzlibOptions`](interfaces/UnzlibOptions.md) | The decompression options |

#### Returns

`Uint8Array`

The decompressed version of the data

___

### zip

▸ **zip**(`data`, `opts`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously creates a ZIP file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`AsyncZippable`](interfaces/AsyncZippable.md) | The directory structure for the ZIP archive |
| `opts` | [`AsyncZipOptions`](interfaces/AsyncZipOptions.md) | The main options, merged with per-file options |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The callback to call with the generated ZIP archive |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the compression

▸ **zip**(`data`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously creates a ZIP file

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`AsyncZippable`](interfaces/AsyncZippable.md) | The directory structure for the ZIP archive |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The callback to call with the generated ZIP archive |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the compression

___

### zipSync

▸ **zipSync**(`data`, `opts?`): `Uint8Array`

Synchronously creates a ZIP file. Prefer using `zip` for better performance
with more than one file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`Zippable`](interfaces/Zippable.md) | The directory structure for the ZIP archive |
| `opts?` | [`ZipOptions`](interfaces/ZipOptions.md) | The main options, merged with per-file options |

#### Returns

`Uint8Array`

The generated ZIP archive

___

### zlib

▸ **zlib**(`data`, `opts`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously compresses data with Zlib

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to compress |
| `opts` | [`AsyncZlibOptions`](interfaces/AsyncZlibOptions.md) | The compression options |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon compression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

▸ **zlib**(`data`, `cb`): [`AsyncTerminable`](interfaces/AsyncTerminable.md)

Asynchronously compresses data with Zlib

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to compress |
| `cb` | [`FlateCallback`](README.md#flatecallback) | The function to be called upon compression completion |

#### Returns

[`AsyncTerminable`](interfaces/AsyncTerminable.md)

A function that can be used to immediately terminate the compression

___

### zlibSync

▸ **zlibSync**(`data`, `opts?`): `Uint8Array`

Compress data with Zlib

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Uint8Array` | The data to compress |
| `opts?` | [`ZlibOptions`](interfaces/ZlibOptions.md) | The compression options |

#### Returns

`Uint8Array`

The zlib-compressed version of the data
