import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
  strToU8,
  unzip,
  Unzip,
  UnzipDecoderConstructor,
  UnzipPassThrough,
  Unzipped,
  unzipSync,
  zip,
  Zip,
  ZipPassThrough,
  zipSync,
} from '../src';

/**
 * TODO: test ZIP
 *
 * Notes:
 * 1. zip archives store file times as local time, using UTC
 *    times would cause tests below to fail in other timezones.
 *    So `new Date('2025-01-31T00:00:00')` (local) will work
 *    fine, while `new Date('2025-01-31')` (UTC) will not.
 */

const zipSyncFn = suite('zipSync');

zipSyncFn('should create valid zip file', async () => {
  const zipped = zipSync({
    'hello.txt': strToU8('Hello there'),
    'some.file': new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD]),
  }, { mtime: new Date('2025-01-31T00:00:00'), level: 0 });

  assertSnapshotOfBytes(zipped, [
    // local file header 1
    '504B0304', '1400', '0000', '0000', '0000', '3F5A', '87668EEB', '0B000000', '0B000000', '0900', '0000',
    '68656C6C6F2E747874', // file name
    '48656C6C6F207468657265', // file data

    // local file header 2
    '504B0304', '1400', '0000', '0000', '0000', '3F5A', 'A701B455', '04000000', '04000000', '0900', '0000',
    '736F6D652E66696C65', // file name
    'AABBCCDD', // file data

    // central directory header 1
    '504B0102', '1400', '1400', '0000', '0000', '0000', '3F5A', '87668EEB', '0B000000', '0B000000',
    '0900', '0000', '0000', '0000', '0000', '00000000', '00000000',
    '68656C6C6F2E747874', // file name

    // central directory header 2
    '504B0102', '1400', '1400', '0000', '0000', '0000', '3F5A', 'A701B455', '04000000', '04000000',
    '0900', '0000', '0000', '0000', '0000', '00000000', '32000000',
    '736F6D652E66696C65', // file name

    // end of central directory record
    '504B0506', '0000', '0000', '0200', '0200', '6E000000', '5D000000', '0000',
  ]);
  await assertSuccessfulUnpack(zipped, UnzipPassThrough, {
    'hello.txt': strToU8('Hello there'),
    'some.file': new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD]),
  });
});

zipSyncFn('should add Zip64 EOCD data when standard EOCDR is not enough', () => {
  const filesToZip = {};
  for (let i = 0; i < 70_000; i++) {
    filesToZip[i] = new Uint8Array();
  }

  const data = zipSync(filesToZip, { level: 0 });

  assertSnapshotOfBytes(data.slice(-98), [
    // Zip64 end of central directory record:
    '50 4B 06 06', // 0x06064b50
    '2C 00 00 00 00 00 00 00', // 44
    '2D 00', // 45 | 0
    '2D 00', // 45 | 0
    '00 00 00 00',
    '00 00 00 00',
    '70 11 01 00 00 00 00 00', // 70_000
    '70 11 01 00 00 00 00 00', // 70_000
    'EA 4D 36 00 00 00 00 00', // central dir length
    'EA 36 25 00 00 00 00 00', // central dir position
    // Zip64 end of central directory locator:
    '50 4B 06 07', // 0x07064b50
    '00 00 00 00',
    'D4 84 5B 00 00 00 00 00', // Zip64 EOCDR position
    '01 00 00 00', // 1 - total number of disks
    // End of central directory record:
    '50 4B 05 06', // 0x06054b50
    '00 00',
    '00 00',
    'FF FF', // files count set to max 0xffff - actual value in Zip64 EOCDR
    'FF FF', // as above
    'EA 4D 36 00', // central dir length
    'EA 36 25 00', // central dir position
    '00 00',
  ]);
  assert.equal(data.slice(-58, -54), data.slice(-10, -6)); // central dir length
  assert.equal(data.slice(-50, -46), data.slice(-6, -2)); // central dir position
  assert.is(new DataView(data.slice(-34, -30).buffer).getUint32(0, true), data.length - 98); // Zip64 EOCDR position
});

zipSyncFn('should not add Zip64 EOCD data when is it not necessary', () => {
  const filesToZip = {};
  for (let i = 0; i < 65_535; i++) {
    filesToZip[i] = new Uint8Array();
  }

  const data = zipSync(filesToZip, { level: 0 });

  const dv = new DataView(data.buffer);
  for (let i = data.length - 4; i >= 0; i--) {
    const signature = dv.getUint32(i, true);
    if (signature === 0x06054B50) {
      assert.is(i, data.length - 22);
    }
    assert.is.not(signature, 0x06064B50);
    assert.is.not(signature, 0x07064B50);
  }
});

zipSyncFn.run();


const zipFn = suite('zip');

zipFn('should create valid zip file', async () => {
  const zipped = await new Promise<Uint8Array>((resolve, reject) => {
    zip({
        'hello.txt': strToU8('Hello there'),
        'some.file': new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD]),
      },
      { mtime: Date.parse('2025-01-31T00:00:00'), level: 0 },
      (err, data) => err ? reject(err) : resolve(data),
    );
  });

  assertSnapshotOfBytes(zipped, [
    // local file header 1
    '504B0304', '1400', '0000', '0000', '0000', '3F5A', '87668EEB', '0B000000', '0B000000', '0900', '0000',
    '68656C6C6F2E747874', // file name
    '48656C6C6F207468657265', // file data

    // local file header 2
    '504B0304', '1400', '0000', '0000', '0000', '3F5A', 'A701B455', '04000000', '04000000', '0900', '0000',
    '736F6D652E66696C65', // file name
    'AABBCCDD', // file data

    // central directory header 1
    '504B0102', '1400', '1400', '0000', '0000', '0000', '3F5A', '87668EEB', '0B000000', '0B000000',
    '0900', '0000', '0000', '0000', '0000', '00000000', '00000000',
    '68656C6C6F2E747874', // file name

    // central directory header 2
    '504B0102', '1400', '1400', '0000', '0000', '0000', '3F5A', 'A701B455', '04000000', '04000000',
    '0900', '0000', '0000', '0000', '0000', '00000000', '32000000',
    '736F6D652E66696C65', // file name

    // end of central directory record
    '504B0506', '0000', '0000', '0200', '0200', '6E000000', '5D000000', '0000',
  ]);
  await assertSuccessfulUnpack(zipped, UnzipPassThrough, {
    'hello.txt': strToU8('Hello there'),
    'some.file': new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD]),
  });
});

zipFn.run();


const zipClass = suite('Zip');

zipClass('should create valid zip file', async () => {
  const zipped = await new Promise<Uint8Array>((resolve, reject) => {
    const chunks = [];
    const zip = new Zip();
    zip.ondata = (err, chunk, final) => {
      if (err) reject(err);
      chunks.push(chunk);
      if (final) resolve(mergeChunks(chunks));
    };

    const txtFile = new ZipPassThrough('hello.txt');
    txtFile.mtime = new Date('2025-01-31 00:00');
    zip.add(txtFile);
    txtFile.push(strToU8('Hello there'), true);

    const someFile = new ZipPassThrough('some.file');
    someFile.mtime = new Date('2025-01-31T00:00:00');
    zip.add(someFile);
    someFile.push(new Uint8Array([0xAA, 0xBB]));
    someFile.push(new Uint8Array([0xCC, 0xDD]), true);

    zip.end();
  });

  assertSnapshotOfBytes(zipped, [
    // local file header 1 <- this file was added in one go, [data descriptor 1] was NOT needed
    '504B0304', '1400', /*->*/'0000', // <- bit 3 of the general purpose bit flag is NOT set
    '0000', '0000', '3F5A', /*->*/'87668EEB', '0B000000', '0B000000', // crc-32, sc, su are defined
    '0900', '0000',
    '68656C6C6F2E747874', // file name
    '48656C6C6F207468657265', // file data

    // local file header 2 <- this file was added in 2 parts, [data descriptor 2] was needed
    '504B0304', '1400', /*->*/'0800', // <- bit 3 of the general purpose bit flag is set
    '0000', '0000', '3F5A', /*->*/'00000000', '00000000', '00000000', // <- crc-32, sc, su set to zeros
    '0900', '0000',
    '736F6D652E66696C65', // file name
    'AABBCCDD', // file data
    // data descriptor 2
    '504B0708', /*->*/'A701B455', '04000000', '04000000', // <- crc-32, sc, su are here

    // central directory header 1
    '504B0102', '1400', '1400', '0000', '0000', '0000', '3F5A', '87668EEB', '0B000000', '0B000000',
    '0900', '0000', '0000', '0000', '0000', '00000000', '00000000',
    '68656C6C6F2E747874', // file name

    // central directory header 2
    '504B0102', '1400', '1400', '0800', '0000', '0000', '3F5A', 'A701B455', '04000000', '04000000',
    '0900', '0000', '0000', '0000', '0000', '00000000', '32000000',
    '736F6D652E66696C65', // file name

    // end of central directory record
    '504B0506', '0000', '0000', '0200', '0200', '6E000000', '6D000000', '0000',
  ]);
  await assertSuccessfulUnpack(zipped, UnzipPassThrough, {
    'hello.txt': strToU8('Hello there'),
    'some.file': new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD]),
  });
});

zipClass('should add Zip64 Extra Field if one of the fields in file header is too small', async () => {
  const zipped = await new Promise<Uint8Array>((resolve, reject) => {
    const chunks = [];
    const zip = new Zip();
    zip.ondata = (err, chunk, final) => {
      if (err) reject(err);
      chunks.push(chunk);
      if (final) resolve(mergeChunks(chunks));
    };

    class BigFileMock extends ZipPassThrough {
      originalSizeMock: number;
      zip64?: boolean;

      protected process(chunk: Uint8Array, final: boolean) {
        this.size = this.originalSizeMock;
        this.ondata(null, chunk, final);
      }
    }

    const bf1 = new BigFileMock('big-1');
    bf1.originalSizeMock = 1024 * 1024 * 1024 * 8.3; // 8.3GB
    bf1.zip64 = true; // flag to work must be set before `zip.add(file)`
    bf1.compression = 8;
    bf1.os = 3;
    bf1.attrs = 0o644 << 16;
    bf1.mtime = Date.parse('2025-01-31T04:00:00');
    zip.add(bf1);
    bf1.push(new Uint8Array([0xAA, 0xBB, 0xCC]));
    bf1.push(new Uint8Array([0xDD]), true); // added in chunks

    const bf2 = new BigFileMock('big-2');
    bf2.originalSizeMock = 1024 * 1024 * 1024 * 5.2; // 5.2GB
    bf2.compression = 8;
    bf2.extra = { 0xABCD: new Uint8Array([0xBA, 0xBA]) };
    bf2.mtime = Date.parse('2025-01-16T08:00:00');
    zip.add(bf2);
    bf2.push(new Uint8Array([0xEE, 0xEE, 0xEE]), true);  // added in one go

    const bf3 = new BigFileMock('big-3');
    bf3.originalSizeMock = 1024 * 1024 * 512; // 512MB
    bf3.zip64 = true; // should be important only in [local file header 3]
    bf3.compression = 8;
    bf3.mtime = Date.parse('2025-01-16T12:00:00');
    zip.add(bf3);
    bf3.push(new Uint8Array([0x77, 0x77]));
    bf3.push(new Uint8Array([0x77]), true);

    const sf = new ZipPassThrough('small');
    sf.zip64 = true; // should be ignored when it turns out Data Descriptor is not needed
    sf.mtime = new Date('2025-01-01T16:00:00');
    sf.comment = 'comment sample';
    zip.add(sf);
    sf.push(new Uint8Array([0xCC, 0xBB, 0xAA]), true);

    zip.end();
  });

  assertSnapshotOfBytes(zipped, [
    // local file header 1
    '504B0304', '1400', '0800', '0800', '0020', '3F5A', /*->*/'00000000', '00000000', '00000000'/*<-*/, '0500', '0400',
    '6269672D31', // file name
    '0100 0000', // <- Zip64 extra field with zero fields - only to indicate that [data descriptor 1] is in Zip64 format
    'AABBCCDD', // file data
    // data descriptor 1
    '504B0708', 'A701B455', '0400000000000000', '3333331302000000', // <- 8 bytes per size field!

    // local file header 2
    '504B0304', '1400', '0000', '0800', '0040', '305A', 'A53572DB', /*->*/'FFFFFFFF', 'FFFFFFFF'/*<-*/, '0500', '1A00',
    '6269672D32', // file name
    '0100 1000 CCCCCC4C01000000 0300000000000000', // <- Zip64 extra field with two fields
    'CDAB 0200 BABA', // custom extra field
    'EEEEEE', // file data

    // local file header 3
    '504B0304', '1400', '0800', '0800', '0060', '305A', /*->*/'00000000', '00000000', '00000000'/*<-*/, '0500', '0400',
    '6269672D33', // file name
    '0100 0000', // <- Zip64 extra field with zero fields, thanks to `zip64` flag
    '777777', // file data
    // data descriptor 3
    '504B0708', '69ACE000', '0300000000000000', '0000002000000000',

    // local file header 4
    '504B0304', '1400', '0000', '0000', '0080', '215A', 'B38BC656', '03000000', '03000000', '0500', '0000',
    '736D616C6C', // file name
    'CCBBAA', // file data

    // central directory header 1
    '504B0102', '1403', '1400', '0800', '0800', '0020', '3F5A', 'A701B455', '04000000', /*->*/'FFFFFFFF'/*<-*/,
    '0500', '0C00', '0000', '0000', '0000', '0000A401', '00000000',
    '6269672D31', // file name
    '0100 0800 3333331302000000', // <- Zip64 extra field with one field

    // central directory header 2
    '504B0102', '1400', '1400', '0000', '0800', '0040', '305A', 'A53572DB', '03000000', /*->*/'FFFFFFFF'/*<-*/,
    '0500', '1200', '0000', '0000', '0000', '00000000', '43000000',
    '6269672D32',  // file name
    '0100 0800 CCCCCC4C01000000', // <- Zip64 extra field with one field
    'CDAB 0200 BABA', // custom extra field

    // central directory header 3
    '504B0102', '1400', '1400', '0800', '0800', '0060', '305A', '69ACE000', '03000000', '00000020',
    '0500', '0000', '0000', '0000', '0000', '00000000', '83000000',
    '6269672D33', // file name
    // no need for Zip64 extra field

    // central directory header 4
    '504B0102', '1400', '1400', '0000', '0000', '0080', '215A', 'B38BC656', '03000000', '03000000',
    '0500', '0000', '0E00', '0000', '0000', '00000000', 'C5000000',
    '736D616C6C', // file name
    '636F6D6D656E742073616D706C65', // file comment

    // end of central directory record
    '504B0506', '0000', '0000', '0400', '0400', 'F8000000', 'EB000000', '0000',
  ]);
});

zipClass.run();


const unzipping = suite('unzipping');

unzipping('should unpack zip where some file has Zip64 Extra Field, but there is no Zip64 EOCD', async () => {
  const zipped = hexToBytes([
    '504B030414000000000000083F5AA701B455FFFFFFFFFFFFFFFF080014006269672D66696C65',
    '0100 1000 3333331302000000 0400000000000000', // Zip64 extra field with two fields
    'AABBCCDD',
    '504B030414000000000000083F5A42E2D40E01000000010000000A000000736D616C6C2D66696C652E',
    '504B0102140014000000000000083F5AA701B45504000000FFFFFFFF08000C0000000000000000000000000000006269672D66696C65',
    '0100 0800 3333331302000000', // Zip64 extra field with one field
    '504B0102140014000000000000083F5A42E2D40E01000000010000000A000000000000000000000000003E000000736D616C6C2D66696C65',
    '504B050600000000020002007A000000670000000000',
  ]);

  unzipSync(zipped, {
    filter: (file) => {
      if (file.name === 'big-file') {
        assert.is(file.originalSize, 8912057139); // should get uncompressed size from Zip64 extra field
      } else if (file.name === 'small-file') {
        assert.is(file.originalSize, 1);
      } else {
        assert.unreachable();
      }
      return false;
    },
  });

  await assertSuccessfulUnpack(zipped, UnzipPassThrough, {
    'big-file': new Uint8Array([0xAA, 0xBB, 0xCC, 0xDD]),
    'small-file': strToU8('.'),
  });
});

unzipping('should handle files with Data Descriptor in Zip64 format', async () => {
  const zipped = hexToBytes([
    '504B03041400080000000060215A000000000000000000000000020004006631',
    '0100 0000', // Zip64 extra field with zero fields
    '6C6F72656D20697073756D20646F6C6F7220736974',
    '504B0708 38284BA5 1500000000000000 1500000000000000', // Data Descriptor 1 in Zip64 format
    '504B03041400080000000070215A000000000000000000000000020000006632616D65742C20636F6E7365637465747572',
    '504B0708 C82D7309 11000000 11000000', // Data Descriptor 2
    '504B03041400000000000080215A000000000000000000000000020000006633',
    '504B010214001400080000000060215A38284BA515000000150000000200000000000000000000000000000000006631',
    '504B010214001400080000000070215AC82D730911000000110000000200000000000000000000000000510000006632',
    '504B010214001400000000000080215A0000000000000000000000000200000005000000000000000000920000006633',
    '68656C6C6F', // file 3 comment
    '504B0506000000000300030095000000B20000000000',
  ]);

  await assertSuccessfulUnpack(zipped, UnzipPassThrough, {
    'f1': strToU8('lorem ipsum dolor sit'),
    'f2': strToU8('amet, consectetur'),
    'f3': new Uint8Array(), // empty file
  });
});

unzipping.run();


function assertSnapshotOfBytes(actual: Uint8Array, expects: string | string[]) { // for better diff printing
  assert.equal(
    Array.from(actual, n => n.toString(16).toUpperCase().padStart(2, '0')).join(' '),
    (Array.isArray(expects) ? expects.join('') : expects).replace(/\s/g, '').replace(/\S{2}(?!$)/g, '$& '),
  );
}

function hexToBytes(hex: string | string[]) {
  const str = Array.isArray(hex) ? hex.join('') : hex;
  const b = Buffer.from(str.replace(/\s/g, ''), 'hex');
  return new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
}

function mergeChunks(chunks: Buffer[]) {
  const b = Buffer.concat(chunks);
  return new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
}

async function assertSuccessfulUnpack(zipArchive: Uint8Array, Decoder: UnzipDecoderConstructor, expected: Unzipped) {
  assert.equal(unpackSync(zipArchive), expected);
  assert.equal(await unpackAsync(zipArchive), expected);
  assert.equal(await unpackStream(zipArchive, Decoder), expected);
}

function unpackSync(zipArchive: Uint8Array) {
  return unzipSync(zipArchive);
}

function unpackAsync(zipArchive: Uint8Array) {
  return new Promise((resolve, reject) => {
    unzip(zipArchive, (err, data) => err ? reject(err) : resolve(data));
  });
}

function unpackStream(zipArchive: Uint8Array, Decoder: UnzipDecoderConstructor) {
  return new Promise(async (resolve) => {
    const result = {};
    const toAwait = [];
    const unzip = new Unzip(entry => {
      toAwait.push(new Promise<void>((resolve, reject) => {
        const chunks = [];
        entry.ondata = (err, chunk, final) => {
          if (err) reject(err);
          chunks.push(chunk);
          if (final) {
            result[entry.name] = mergeChunks(chunks);
            resolve();
          }
        };
        entry.start();
      }));
    });
    unzip.register(Decoder);
    unzip.push(zipArchive, true);
    await Promise.all(toAwait);
    resolve(result);
  });
}
