// TODO: test all async operations (including streams and ZIP)
import * as fflate from '../src/index';
import * as assert from 'uvu/assert';
import { suite } from 'uvu';
import { Worker } from 'worker_threads';

const asyncUnzipSuite = suite('async unzip');

asyncUnzipSuite('sends each worker only the file it inflates, not the whole archive', async () => {
  // Large and compressible enough to be inflated in a worker
  const text = new TextEncoder().encode('fflate '.repeat(100000));
  const archive = fflate.zipSync({
    'padding.bin': [new Uint8Array(8 * 1024 * 1024), { level: 0 }],
    'a.txt': text,
    'b.txt': text
  });
  const sent: number[] = [];
  const postMessage = Worker.prototype.postMessage;
  Worker.prototype.postMessage = function (msg: unknown, transfer?: readonly any[]) {
    if (Array.isArray(msg) && msg[0] instanceof Uint8Array) sent.push(msg[0].buffer.byteLength);
    return postMessage.call(this, msg, transfer as any);
  };
  let files: fflate.Unzipped;
  try {
    files = await new Promise<fflate.Unzipped>((resolve, reject) =>
      fflate.unzip(archive, (err, data) => (err ? reject(err) : resolve(data)))
    );
  } finally {
    Worker.prototype.postMessage = postMessage;
  }
  assert.ok(Buffer.from(files['a.txt']).equals(Buffer.from(text)));
  assert.ok(Buffer.from(files['b.txt']).equals(Buffer.from(text)));
  assert.is(sent.length, 2);
  for (const bytes of sent) assert.ok(bytes < text.length, `a worker was sent ${bytes} bytes for one file`);
});

asyncUnzipSuite.run();
