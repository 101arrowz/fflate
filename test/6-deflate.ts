import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { inflateRawSync } from 'zlib';
import { deflateSync } from '..';

// Read the distance alphabet from a dynamic DEFLATE header (RFC 1951, 3.2.7).
const distanceLengths = (data: Uint8Array) => {
  let pos = 0;
  const read = (bits: number) => {
    let value = 0;
    for (let i = 0; i < bits; ++i, ++pos) {
      assert.ok(pos < data.length * 8, 'truncated DEFLATE header');
      value |= ((data[pos >> 3] >> (pos & 7)) & 1) << i;
    }
    return value;
  };
  read(1);
  assert.is(read(2), 2, 'fixture should use dynamic Huffman coding');
  const literals = read(5) + 257, distances = read(5) + 1;
  const count = read(4) + 4;
  const order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  const lengths = new Array<number>(19).fill(0);
  for (let i = 0; i < count; ++i) lengths[order[i]] = read(3);

  const codes: Record<string, number> = {};
  let code = 0;
  for (let bits = 1; bits <= 7; ++bits) {
    for (let symbol = 0; symbol < lengths.length; ++symbol) {
      if (lengths[symbol] == bits) codes[bits + ':' + code++] = symbol;
    }
    code <<= 1;
  }
  const decode = () => {
    let value = 0;
    for (let bits = 1; bits <= 7; ++bits) {
      value = (value << 1) | read(1);
      const symbol = codes[bits + ':' + value];
      if (symbol != null) return symbol;
    }
    throw new Error('invalid code length symbol');
  };
  const result: number[] = [];
  while (result.length < literals + distances) {
    const symbol = decode();
    if (symbol < 16) result.push(symbol);
    else {
      const value = symbol == 16 ? result[result.length - 1] : 0;
      const repeat = symbol == 16 ? read(2) + 3 : symbol == 17 ? read(3) + 3 : read(7) + 11;
      for (let i = 0; i < repeat; ++i) result.push(value);
    }
  }
  assert.is(result.length, literals + distances);
  return result.slice(literals);
};

const deflate = suite('literal-only dynamic blocks');
for (const level of [1, 6, 9] as const) {
  deflate('has a distance code for ZIP decoder compatibility at level ' + level, () => {
    // Skewed frequencies favor a dynamic block, but no three-byte sequence repeats.
    const data = new Uint8Array(96);
    for (let i = 0; i < 48; ++i) data[i * 2 + 1] = i;
    const compressed = deflateSync(data, { level });
    assert.equal(new Uint8Array(inflateRawSync(compressed)), data);
    // Windows' ZIP decoder rejects the otherwise valid empty distance alphabet.
    assert.ok(distanceLengths(compressed).some(length => length > 0));
  });
}
deflate.run();
