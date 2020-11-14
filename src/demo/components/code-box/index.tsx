import React, { FC, useRef, useState } from 'react';
import Highlight, { DefaultProps } from 'prism-react-renderer';
import Prism from './prism';
import './prism';
import './prism.css';
import exec from './sandbox';

const canStream = 'stream' in File.prototype;

type Preset = {
  fflate: string;
  uzip: string;
  pako: string;
};

const presets: Record<string, Preset> = {
  'Basic GZIP compression': {
    fflate: `var file = files[0];
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
    uzip: `var file = files[0];
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
    pako: `var file = files[0];
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
    fflate: `const { AsyncGzip } = fflate;
const file = files[0];
const gzipStream = new AsyncGzip({ level: 6 });
// We can stream the file through GZIP to reduce memory usage
const fakeResponse = new Response(
  file.stream().pipeThrough(toNativeStream(gzipStream))
);
fakeResponse.arrayBuffer().then(buf => {
  callback(new Uint8Array(buf));
});`,
    uzip: `// UZIP doesn't support streaming to any extent`,
    pako: `// Hundreds of lines of code to make this run on a Worker...
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

const CodeHighlight: FC<{
  code: string;
  onInput: (newCode: string) => void;
}> = ({ code, onInput }) => {
  const tmpParen = useRef(-1);
  return (
    <pre className="language-javascript" style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#2a2734',
      color: '#9a86fd',
      fontSize: '0.7em'
    }}>
      <div>
      <Highlight Prism={Prism.Prism as unknown as DefaultProps['Prism']} code={code} language="javascript">
        {({ tokens, getLineProps, getTokenProps }) => (
            tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  token.empty ? <span style={{ display: 'inline-block' }} /> : <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))
        )}
      </Highlight>
      </div>
      <textarea
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{
          border: 'unset',
          resize: 'none',
          outline: 'none',
          position: 'absolute',
          background: 'transparent',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          lineHeight: 'inherit',
          fontSize: 'inherit',
          padding: 'inherit',
          color: 'transparent',
          caretColor: 'white',
          fontFamily: 'inherit'
        }}
        onKeyDown={e => {
          const t = e.currentTarget;
          let val = t.value;
          const loc = t.selectionStart;
          let newTmpParen = -1;
          if (e.key == 'Enter') {
            const lastNL = val.lastIndexOf('\n', loc - 1);
            let indent = 0;
            for (; val.charCodeAt(indent + lastNL + 1) == 32; ++indent);
            const lastChar = val.charAt(loc - 1);
            const nextChar = val.charAt(loc);
            if (lastChar == '{'|| lastChar == '(' || lastChar == '[') indent += 2;
            const addNL = nextChar == '}' || nextChar == ')' || nextChar == ']';
            const tail = val.slice(t.selectionEnd);
            val = val.slice(0, loc) + '\n';
            for (let i = 0; i < indent; ++i) val += ' ';
            if (addNL) {
              if (
                (lastChar == '{' && nextChar == '}') ||
                (lastChar == '[' && nextChar == ']') || 
                (lastChar == '(' && nextChar == ')')
              ) {
                val += '\n';
                for (let i = 2; i < indent; ++i) val += ' ';
              } else {
                const end = Math.min(indent, 2);
                indent -= end;
                val = val.slice(0, -end);
              }
            }
            val += tail;
            t.value = val;
            t.selectionStart = t.selectionEnd = loc + indent + 1;
          } else if (e.key == 'Tab') {
            val = val.slice(0, loc) + '  ' + val.slice(t.selectionEnd);
            t.value = val;
            t.selectionStart = t.selectionEnd = loc + 2;
          } else if (t.selectionStart == t.selectionEnd) {
            if (e.key == 'Backspace') {
              if (val.charCodeAt(loc - 1) == 32 && !val.slice(val.lastIndexOf('\n', loc - 1), loc).trim().length) {
                val = val.slice(0, loc - 2) + val.slice(loc);
                t.value = val;
                t.selectionStart = t.selectionEnd = loc - 2;
              } else if (
                (val.charAt(loc - 1) == '{' && val.charAt(loc) == '}') ||
                (val.charAt(loc - 1) == '[' && val.charAt(loc) == ']') ||
                (val.charAt(loc - 1) == '(' && val.charAt(loc) == ')')
              ) {
                val = val.slice(0, loc - 1) + val.slice(loc + 1);
                t.value = val;
                t.selectionStart = t.selectionEnd = loc - 1;
              } else return;
            } else {
              let a: string;
              switch(e.key) {
                case '{':
                case '[':
                case '(':
                  t.value = val = val.slice(0, loc) + (e.key == '{' ? '{}' : e.key == '[' ? '[]' : '()') + val.slice(loc);
                  t.selectionStart = t.selectionEnd = newTmpParen = loc + 1;
                  break;
                case '}':
                case ']':
                case ')': 
                  // BUG: if the cursor is moved, this false activates
                  if (tmpParen.current != loc) {
                    const lastNL = val.lastIndexOf('\n', loc - 1);
                    const sl = val.slice(lastNL, loc);
                    t.value = val = val.slice(0, loc - (sl.length > 1 && !sl.trim().length ? 2 : 0)) + e.key + val.slice(loc);
                  }
                  t.selectionEnd = t.selectionStart = loc + 1;
                  break;
                default:
                  tmpParen.current = -1;
                  return;
              }
            };
          } else return;
          tmpParen.current = newTmpParen;
          e.preventDefault();
          onInput(val);
        }}
        onInput={e => onInput(e.currentTarget.value)}
        >
        {code}
      </textarea>
    </pre> 
  )
};

const CodeBox: FC<{files: File[]}> = ({ files }) => {
  const [{ fflate, uzip, pako }, setCodes] = useState(presets['Streaming GZIP compression']);
  const onInput = (lib: 'fflate' | 'uzip' | 'pako', code: string) => {
    const codes: Preset = {
      fflate,
      uzip,
      pako
    };
    codes[lib] = code;
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
          <CodeHighlight code={fflate} onInput={t => onInput('fflate', t)} />
        </div>
        <div>
          UZIP (shimmed):
          <CodeHighlight code={uzip} onInput={t => onInput('uzip', t)} />
        </div>
        <div>
          Pako (shimmed):
          <CodeHighlight code={pako} onInput={t => onInput('pako', t)} />
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