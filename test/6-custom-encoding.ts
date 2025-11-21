import * as fflate from '../src/index';
import * as assert from 'uvu/assert';
import { suite } from 'uvu';

const customEncodingSuite = suite('Custom Filename Encoding');

// Helper function to create a ZIP file with custom encoded filename
function createZipWithCustomEncoding(filename: Uint8Array, content: Uint8Array): Uint8Array {
  // First create a normal ZIP file with a placeholder name
  const zipData = fflate.zipSync({ 'placeholder': content });
  
  // Now we need to modify the ZIP to replace the filename and clear UTF-8 flag
  // ZIP structure: Local file header + file data + Central directory + EOCD
  
  // Find and modify local file header (starts with 0x04034b50)
  let localHeaderPos = 0;
  for (let i = 0; i < zipData.length - 4; i++) {
    if (zipData[i] === 0x50 && zipData[i+1] === 0x4b && zipData[i+2] === 0x03 && zipData[i+3] === 0x04) {
      localHeaderPos = i;
      break;
    }
  }
  
  // Find central directory (starts with 0x02014b50)
  let centralDirPos = 0;
  for (let i = localHeaderPos + 30; i < zipData.length - 4; i++) {
    if (zipData[i] === 0x50 && zipData[i+1] === 0x4b && zipData[i+2] === 0x01 && zipData[i+3] === 0x02) {
      centralDirPos = i;
      break;
    }
  }
  
  const oldFilenameLen = 11; // "placeholder".length
  const newFilenameLen = filename.length;
  const sizeDiff = newFilenameLen - oldFilenameLen;
  
  // Create new ZIP buffer with adjusted size (filename appears twice: local header + central directory)
  const newZip = new Uint8Array(zipData.length + sizeDiff * 2);
  
  // Copy up to filename in local header
  newZip.set(zipData.subarray(0, localHeaderPos + 26));
  
  // Update filename length in local header
  newZip[localHeaderPos + 26] = newFilenameLen & 0xFF;
  newZip[localHeaderPos + 27] = (newFilenameLen >> 8) & 0xFF;
  
  // Clear UTF-8 flag (bit 11) in general purpose bit flag
  newZip[localHeaderPos + 6] = zipData[localHeaderPos + 6] & ~0x08;
  newZip[localHeaderPos + 7] = zipData[localHeaderPos + 7] & ~0x08;
  
  // Copy extra field length
  newZip.set(zipData.subarray(localHeaderPos + 28, localHeaderPos + 30), localHeaderPos + 28);
  
  // Insert new filename
  newZip.set(filename, localHeaderPos + 30);
  
  // Copy rest of local header and file data
  const afterFilenamePos = localHeaderPos + 30 + oldFilenameLen;
  newZip.set(zipData.subarray(afterFilenamePos, centralDirPos), localHeaderPos + 30 + newFilenameLen);
  
  // Update central directory
  const newCentralDirPos = centralDirPos + sizeDiff;
  newZip.set(zipData.subarray(centralDirPos, centralDirPos + 28), newCentralDirPos);
  
  // Update filename length in central directory
  newZip[newCentralDirPos + 28] = newFilenameLen & 0xFF;
  newZip[newCentralDirPos + 29] = (newFilenameLen >> 8) & 0xFF;
  
  // Clear UTF-8 flag in central directory
  newZip[newCentralDirPos + 8] = zipData[centralDirPos + 8] & ~0x08;
  newZip[newCentralDirPos + 9] = zipData[centralDirPos + 9] & ~0x08;
  
  // Copy extra, comment lengths
  newZip.set(zipData.subarray(centralDirPos + 30, centralDirPos + 46), newCentralDirPos + 30);
  
  // Insert new filename in central directory
  newZip.set(filename, newCentralDirPos + 46);
  
  // Copy rest of central directory and EOCD
  const afterCentralFilename = centralDirPos + 46 + oldFilenameLen;
  newZip.set(zipData.subarray(afterCentralFilename), newCentralDirPos + 46 + newFilenameLen);
  
  // Update EOCD offsets
  // Find EOCD (starts with 0x06054b50)
  for (let i = newZip.length - 22; i >= 0; i--) {
    if (newZip[i] === 0x50 && newZip[i+1] === 0x4b && newZip[i+2] === 0x05 && newZip[i+3] === 0x06) {
      // Update central directory size
      const oldSize = zipData[i + 12] | (zipData[i + 13] << 8) | (zipData[i + 14] << 16) | (zipData[i + 15] << 24);
      const newSize = oldSize + sizeDiff;
      newZip[i + 12] = newSize & 0xFF;
      newZip[i + 13] = (newSize >> 8) & 0xFF;
      newZip[i + 14] = (newSize >> 16) & 0xFF;
      newZip[i + 15] = (newSize >> 24) & 0xFF;
      
      // Update central directory offset
      const newOffset = newCentralDirPos;
      newZip[i + 16] = newOffset & 0xFF;
      newZip[i + 17] = (newOffset >> 8) & 0xFF;
      newZip[i + 18] = (newOffset >> 16) & 0xFF;
      newZip[i + 19] = (newOffset >> 24) & 0xFF;
      break;
    }
  }
  
  return newZip;
}

// Simulate GBK encoding (simplified - just for testing)
// In reality, you would use a proper encoding library
function encodeGBK(str: string): Uint8Array {
  // For testing purposes, we'll create a simple mapping
  // This is NOT a real GBK encoder, just for demonstration
  const mapping: Record<string, number[]> = {
    '中': [0xD6, 0xD0],
    '文': [0xCE, 0xC4],
    '测': [0xB2, 0xE2],
    '试': [0xCA, 0xD4],
    '文件': [0xCE, 0xC4, 0xBC, 0xFE],
    '名': [0xC3, 0xFB]
  };
  
  // Simple implementation for testing
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (mapping[char]) {
      bytes.push(...mapping[char]);
    } else if (char.charCodeAt(0) < 128) {
      bytes.push(char.charCodeAt(0));
    } else {
      // Fallback for unmapped characters
      bytes.push(0x3F); // '?'
    }
  }
  return new Uint8Array(bytes);
}

function decodeGBK(data: Uint8Array): string {
  // Reverse mapping for decoding
  const reverseMapping: Record<string, string> = {
    '214,208': '中',
    '206,196': '文',
    '178,226': '测',
    '202,212': '试',
    '195,251': '名'
  };
  
  let result = '';
  let i = 0;
  while (i < data.length) {
    if (data[i] < 128) {
      // ASCII character
      result += String.fromCharCode(data[i]);
      i++;
    } else if (i + 1 < data.length) {
      // Two-byte character
      const key = `${data[i]},${data[i + 1]}`;
      if (reverseMapping[key]) {
        result += reverseMapping[key];
      } else {
        result += '?';
      }
      i += 2;
    } else {
      result += '?';
      i++;
    }
  }
  return result;
}

customEncodingSuite('unzipSync with custom decoder', () => {
  const content = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
  const filename = encodeGBK('测试.txt');
  const zipData = createZipWithCustomEncoding(filename, content);
  
  // Without custom decoder - should get garbled text
  const filesDefault = fflate.unzipSync(zipData);
  const defaultNames = Object.keys(filesDefault);
  assert.is(defaultNames.length, 1);
  // The filename will be incorrectly decoded as Latin-1
  
  // With custom decoder - should get correct Chinese text
  const filesCustom = fflate.unzipSync(zipData, {
    decodeFilename: decodeGBK
  });
  const customNames = Object.keys(filesCustom);
  assert.is(customNames.length, 1);
  assert.is(customNames[0], '测试.txt');
  assert.ok(filesCustom['测试.txt'].length === 5);
});

customEncodingSuite('unzip with custom decoder (async)', async () => {
  const content = new Uint8Array([87, 111, 114, 108, 100]); // "World"
  const filename = encodeGBK('中文');
  const zipData = createZipWithCustomEncoding(filename, content);
  
  return new Promise<void>((resolve, reject) => {
    fflate.unzip(zipData, {
      decodeFilename: decodeGBK
    }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      
      try {
        const names = Object.keys(files);
        assert.is(names.length, 1);
        assert.is(names[0], '中文');
        assert.ok(files['中文'].length === 5);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
});

customEncodingSuite('UTF-8 flag takes precedence over custom decoder', () => {
  // Calculate CRC32 for testing
  const calcCRC32 = (data: Uint8Array): number => {
    const crct = (() => {
      const t = new Int32Array(256);
      for (let i = 0; i < 256; ++i) {
        let c = i, k = 9;
        while (--k) c = ((c & 1) && -306674912) ^ (c >>> 1);
        t[i] = c;
      }
      return t;
    })();
    let crc = -1;
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ crct[(crc ^ data[i]) & 0xFF];
    }
    return ~crc >>> 0;
  };
  
  // Create a ZIP with UTF-8 flag set
  const content = new Uint8Array([72, 105]); // "Hi"
  const filename = fflate.strToU8('UTF-8测试.txt', false); // UTF-8 encoded
  
  // Manually create ZIP with UTF-8 flag set (bit 11)
  const crc = calcCRC32(content);
  const compressed = fflate.deflateSync(content);
  
  const localHeader = new Uint8Array(30 + filename.length);
  const dv = new DataView(localHeader.buffer);
  
  dv.setUint32(0, 0x04034b50, true);
  dv.setUint16(4, 20, true);
  dv.setUint16(6, 0x0800, true); // UTF-8 flag set
  dv.setUint16(8, 8, true);
  dv.setUint16(10, 0, true);
  dv.setUint16(12, 0, true);
  dv.setUint32(14, crc, true);
  dv.setUint32(18, compressed.length, true);
  dv.setUint32(22, content.length, true);
  dv.setUint16(26, filename.length, true);
  dv.setUint16(28, 0, true);
  localHeader.set(filename, 30);
  
  const centralHeader = new Uint8Array(46 + filename.length);
  const cdv = new DataView(centralHeader.buffer);
  
  cdv.setUint32(0, 0x02014b50, true);
  cdv.setUint16(4, 20, true);
  cdv.setUint16(6, 20, true);
  cdv.setUint16(8, 0x0800, true); // UTF-8 flag set
  cdv.setUint16(10, 8, true);
  cdv.setUint16(12, 0, true);
  cdv.setUint16(14, 0, true);
  cdv.setUint32(16, crc, true);
  cdv.setUint32(20, compressed.length, true);
  cdv.setUint32(24, content.length, true);
  cdv.setUint16(28, filename.length, true);
  cdv.setUint16(30, 0, true);
  cdv.setUint16(32, 0, true);
  cdv.setUint16(34, 0, true);
  cdv.setUint16(36, 0, true);
  cdv.setUint32(38, 0, true);
  cdv.setUint32(42, 0, true);
  centralHeader.set(filename, 46);
  
  const eocd = new Uint8Array(22);
  const edv = new DataView(eocd.buffer);
  
  edv.setUint32(0, 0x06054b50, true);
  edv.setUint16(4, 0, true);
  edv.setUint16(6, 0, true);
  edv.setUint16(8, 1, true);
  edv.setUint16(10, 1, true);
  edv.setUint32(12, centralHeader.length, true);
  edv.setUint32(16, localHeader.length + compressed.length, true);
  edv.setUint16(20, 0, true);
  
  const result = new Uint8Array(localHeader.length + compressed.length + centralHeader.length + eocd.length);
  let offset = 0;
  result.set(localHeader, offset);
  offset += localHeader.length;
  result.set(compressed, offset);
  offset += compressed.length;
  result.set(centralHeader, offset);
  offset += centralHeader.length;
  result.set(eocd, offset);
  
  // Even with a custom decoder, UTF-8 flag should take precedence
  const files = fflate.unzipSync(result, {
    decodeFilename: () => 'WRONG_NAME' // This should be ignored
  });
  
  const names = Object.keys(files);
  assert.is(names.length, 1);
  assert.is(names[0], 'UTF-8测试.txt'); // Should be correctly decoded as UTF-8
});

customEncodingSuite('Default behavior without custom decoder', () => {
  // Test that without custom decoder, Latin-1 is used (backward compatibility)
  const content = new Uint8Array([65, 66, 67]); // "ABC"
  // Use Latin-1 compatible bytes
  const filename = new Uint8Array([116, 101, 115, 116, 46, 116, 120, 116]); // "test.txt" in ASCII
  const zipData = createZipWithCustomEncoding(filename, content);
  
  const files = fflate.unzipSync(zipData);
  const names = Object.keys(files);
  assert.is(names.length, 1);
  assert.is(names[0], 'test.txt');
});

customEncodingSuite('UTF-8 encoded filename without UTF-8 flag using custom UTF-8 decoder', () => {
  // This test case simulates a ZIP file that uses UTF-8 encoding for filenames
  // but does NOT set the UTF-8 flag (bit 11). This can happen with some older
  // or non-compliant ZIP creators. By providing a custom UTF-8 decoder, we can
  // still correctly decode these filenames.
  
  const content = new Uint8Array([84, 101, 115, 116, 32, 100, 97, 116, 97]); // "Test data"
  const testFilename = 'UTF8编码文件.txt';
  
  // Encode the filename as UTF-8 (but flag will be cleared by createZipWithCustomEncoding)
  const utf8Filename = fflate.strToU8(testFilename, false);
  const zipData = createZipWithCustomEncoding(utf8Filename, content);
  
  // Without custom decoder - UTF-8 bytes will be interpreted as Latin-1, resulting in mojibake
  const filesDefault = fflate.unzipSync(zipData);
  const defaultNames = Object.keys(filesDefault);
  assert.is(defaultNames.length, 1);
  // The filename will be incorrectly decoded (mojibake)
  assert.is.not(defaultNames[0], testFilename);
  
  // With custom UTF-8 decoder - should correctly decode the filename
  const utf8Decoder = (data: Uint8Array): string => {
    return fflate.strFromU8(data, false); // Use fflate's UTF-8 decoder
  };
  
  const filesCustom = fflate.unzipSync(zipData, {
    decodeFilename: utf8Decoder
  });
  const customNames = Object.keys(filesCustom);
  assert.is(customNames.length, 1);
  assert.is(customNames[0], testFilename); // Should be correctly decoded
  assert.ok(filesCustom[testFilename].length === 9);
  
  // Verify the content is also correct
  const contentStr = fflate.strFromU8(filesCustom[testFilename]);
  assert.is(contentStr, 'Test data');
});

customEncodingSuite.run();
