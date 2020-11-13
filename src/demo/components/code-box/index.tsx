import React, { FC, FormEvent, useState } from 'react';
import exec from './sandbox';

declare const Prism: {
  highlightElement(el: Element): void;
};

const canStream = 'stream' in File.prototype;

type Preset = {
  fflate: string;
  uzip: string;
  pako: string;
};

const presets: Record<string, Preset> = {
  'Basic GZIP compression': {
    fflate: `
var file = files[0];
fileToU8(file, function(buf) {
  fflate.gzip(buf, {
    level: 6,
    // These are optional, but fflate supports the metadata
    mtime: file.lastModified,
    filename: file.name
  }, function(err, data) {
    // Hope you're not causing any errors in the demo ;)
    callback(data);
  });
});`,
    uzip: `
var file = files[0];
fileToU8(file, function(buf) {
  // UZIP doesn't natively support GZIP, but I patched in support for it.
  // In other words, you're better off using fflate for GZIP.

  // Also, UZIP runs synchronously on the main thread. It relies on global
  // state, so you can't even run it in the background without causing bugs.

  // But just for the sake of a performance comparison, try it out.
  uzipWorker.gzip(buf, function(err, data) {
    callback(data);
  });
});`,
    pako: `
var file = files[0];
fileToU8(file, function(buf) {
  // Unlike UZIP, Pako natively supports GZIP, and it doesn't rely on global
  // state. However, it's still 46kB for this basic functionality as opposed
  // to fflate's 7kB, not to mention the fact that there's no easy way to use
  // it asynchronously. I had to add a worker proxy for this to work.

  pakoWorker.gzip(buf, function(err, data) {
    callback(data);
  });
}); `
  }
}

if (canStream) {
  presets['Streaming GZIP compression'] = {
    fflate: `
const { AsyncGzip } = fflate;
const file = files[0];
const gzipStream = new AsyncGzip({ level: 6 });
// We can stream the file through GZIP to reduce memory usage
const fakeResponse = new Response(
  file.stream().pipeThrough(toNativeStream(gzipStream))
);
fakeResponse.arrayBuffer().then(buf => {
  callback(new Uint8Array(buf));
});`,
    uzip: `
// UZIP doesn't support streaming to any extent`,
    pako: `
// Hundreds of lines of code to make this run on a Worker...
const file = files[0];
// In case this wasn't clear already, Pako doesn't actually support this,
// you need to create a custom async stream. I suppose you could copy the
// code used in this demo.
const gzipStream = pakoWorker.createGzip();
const fakeResponse = new Response(
  file.stream().pipeThrough(toNativeStream(gzipStream))
);
fakeResponse.arrayBuffer().then(buf => {
  callback(new Uint8Array(buf));
});`
  };
}

const CodeBox: FC<{files: File[]}> = ({ files }) => {
  const [{ fflate, uzip, pako }, setCodes] = useState(presets['Streaming GZIP compression']);
  const onInput = (ev: FormEvent<HTMLInputElement>) => {
    const codes: Preset ={
      fflate,
      uzip,
      pako
    };
    codes[this as unknown as string] = ev.currentTarget.innerText;
    setCodes(codes);
  }
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        whiteSpace: 'pre-wrap',
        textAlign: 'left'
      }}>
        <div>
          fflate:
          <code contentEditable className="lang-javascript" onInput={onInput.bind('fflate')}>{fflate}</code>
        </div>
        <div>
          UZIP (shimmed):
          <code contentEditable className="lang-javascript" onInput={onInput.bind('uzip')}>{uzip}</code>
        </div>
        <div>
          Pako (shimmed):
          <code contentEditable className="lang-javascript" onInput={onInput.bind('pako')}>{pako}</code>
        </div>
      </div>
      <button onClick={() => {
        let ts = Date.now();
        exec(fflate, files, out => {
          console.log('fflate took', Date.now() - ts);
          ts = Date.now();
          exec(uzip, files, out => {
            console.log('uzip took', Date.now() - ts);
            ts = Date.now();
            exec(pako, files, out => {
              console.log('pako took', Date.now() - ts);
            })
          })
        });
      }}>Run</button>
    </div>
    
  ); 
}

export default CodeBox;