import { AsyncDeflate } from '../../..';

export default (stream: AsyncDeflate, highWaterMark = 65536) => {
  // whether backpressure was observed on readable stream
  let backpressure = false;
  let resolveBackpressure: () => void = () => {};

  // use WHATWG buffering primarily, fflate buffering only to help keep worker message channel fed
  const writable = new WritableStream({
    async write(dat: Uint8Array) {
      stream.push(dat);

      const blockers: Promise<void>[] = [];

      if (stream.queuedSize >= 32768) {
        blockers.push(new Promise(resolve => {
          stream.ondrain = () => {
            if (stream.queuedSize < 32768) resolve();
          }
        }));
      }

      if (backpressure) {
        blockers.push(new Promise(resolve => {
          resolveBackpressure = resolve;
        }));
      }

      await Promise.all(blockers);
    },
    close() {
      stream.push(new Uint8Array(0), true);
    }
  }, {
    highWaterMark,
    size: chunk => chunk.length
  });

  const readable = new ReadableStream({
    start(controller: ReadableStreamDefaultController<Uint8Array>) {
      stream.ondata = (err, chunk, final) => {
        if (err) writable.abort(err.message);
        controller.enqueue(chunk);
        if (controller.desiredSize != null && controller.desiredSize <= 0) {
          backpressure = true;
        } else {
          backpressure = false;
          resolveBackpressure();
        }
        if (final) controller.close();
      }
    },
    pull() {
      backpressure = false;
      resolveBackpressure();
    }
  }, {
    highWaterMark,
    size: chunk => chunk.length
  });

  return { readable, writable };
}