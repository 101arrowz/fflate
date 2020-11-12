import { AsyncDeflate } from '../../..';
export default (stream: AsyncDeflate) => {
  const writable = new WritableStream({
    write(dat: Uint8Array) { stream.push(dat); },
    close() { stream.push(new Uint8Array(0), true); }
  });
  const readable = new ReadableStream({
    start(controller: ReadableStreamDefaultController<Uint8Array>) {
      stream.ondata = (err, chunk, final) => {
        if (err) writable.abort(err.message);
        controller.enqueue(chunk);
        if (final) controller.close();
      }
    }
  });
  return { readable, writable };
}