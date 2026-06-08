import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { bunzip2, bunzip2Sync, strFromU8 } from '../src/index';

const BZ2_SAMPLE = Uint8Array.from(Buffer.from(
  'QlpoOTFBWSZTWeopNX0AAAJTgAAQQAAEACJgDAAgADEGTEEBkeoEPEnfEAvF3JFOFCQ6ik1fQA==',
  'base64'
));

test('bunzip2Sync decodes raw bz2 data', () => {
  const out = bunzip2Sync(BZ2_SAMPLE);
  assert.is(strFromU8(out), 'This is a test\n');
});

test('bunzip2 decodes raw bz2 data', async () => {
  const out = await new Promise<Uint8Array>((resolve, reject) => {
    bunzip2(BZ2_SAMPLE, { size: 15 }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
  assert.is(strFromU8(out), 'This is a test\n');
});

test.run();
