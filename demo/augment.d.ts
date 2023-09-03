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
