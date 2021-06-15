# Interface: UnzipFileInfo

Information about a file to be extracted from a ZIP archive

## Hierarchy

* **UnzipFileInfo**

## Index

### Properties

* [compression](unzipfileinfo.md#compression)
* [name](unzipfileinfo.md#name)
* [originalSize](unzipfileinfo.md#originalsize)
* [size](unzipfileinfo.md#size)

## Properties

### compression

•  **compression**: number

The compression format for the data stream. This number is determined by
the spec in PKZIP's APPNOTE.txt, section 4.4.5. For example, 0 = no
compression, 8 = deflate, 14 = LZMA. If the filter function returns true
but this value is not 8, the unzip function will throw.

___

### name

•  **name**: string

The name of the file

___

### originalSize

•  **originalSize**: number

The original size of the file

___

### size

•  **size**: number

The compressed size of the file
