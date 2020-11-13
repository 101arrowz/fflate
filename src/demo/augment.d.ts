declare module 'uzip' {
  namespace UZIP {
    function deflateRaw(buf: Uint8Array, opts?: { level: number }): Uint8Array;
    function inflateRaw(buf: Uint8Array, out?: Uint8Array): Uint8Array;
    function deflate(buf: Uint8Array, opts?: { level: number }): Uint8Array;
    function inflate(buf: Uint8Array, out?: Uint8Array): Uint8Array;
    function encode(files: Record<string, Uint8Array>, noCmpr?: boolean): ArrayBuffer;
    function parse(buf: ArrayBuffer): Record<string, ArrayBuffer>;
  }
  export = UZIP;
}

interface DataTransferItem {
  webkitGetAsEntry(): FileSystemEntry;
}

interface BaseFileSystemEntry {
  fullPath: string;
  name: string;
  isFile: boolean;
  isDirectory: boolean;
}

interface FileSystemFileEntry extends BaseFileSystemEntry {
  isFile: true;
  isDirectory: false
  file(onSuccess: (file: File) => void, onError: (err: Error) => void): void;
}

type FileSystemEntry = FileSystemFileEntry | FileSystemDirectoryEntry;


interface FileSystemDirectoryReader {
  readEntries(onSuccess: (entries: FileSystemEntry[]) => void, onError: (err: Error) => void): void;
}

interface FileSystemDirectoryEntry extends BaseFileSystemEntry {
  isFile: false;
  isDirectory: true;
  createReader(): FileSystemDirectoryReader;
}

interface File {
  webkitRelativePath: string;
}