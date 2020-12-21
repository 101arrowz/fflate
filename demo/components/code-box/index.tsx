import React, { FC, Ref, useEffect, useMemo, useRef, useState } from 'react';
import { Prism } from './prism';
import './prism';
import './prism.css';
import exec from './sandbox';

const canStream = 'stream' in File.prototype;
const rn = 'Running...';
const wt = 'Waiting...';
const tm = typeof performance != 'undefined'
  ? () => performance.now()
  : () => Date.now();

type Preset = {
  fflate: string;
  uzip: string;
  pako: string;
};

const presets: Record<string, Preset> = {
  'Basic GZIP compression': {
    fflate: `var left = files.length;
var filesLengths = {};

// In a real app, use a list of file types to avoid compressing for better
// performance
var ALREADY_COMPRESSED = [
  'zip', 'gz', 'png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'ppt', 'pptx',
  'xls', 'xlsx', 'heic', 'heif', '7z', 'bz2', 'rar', 'gif', 'webp', 'webm',
  'mp4', 'mov', 'mp3', 'aifc'
];

// This function binds the variable "file" to the local scope, which makes
// parallel processing possible.
// If you use ES6, you can declare variables with "let" to automatically bind
// the variable to the scope rather than using a separate function.
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {
    fflate.gzip(buf, {

      // In a real app, instead of always compressing at a certain level,
      // you'll want to check if the file is already compressed. For fairness,
      // that's not done here.

      /*
      level: ALREADY_COMPRESSED.indexOf(
        file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase()
      ) == -1 ? 6 : 0
      */

      level: 6,

      // You can uncomment the below for a contest of pure algorithm speed.
      // In a real app, you'll probably not need to set the memory level
      // because fflate picks a reasonable level based on file size by default.
      // If fflate performs worse than UZIP, you're probably passing in 
      // incompressible files; switching the level or the mem will fix it.
      
      /*
      mem: 4
      */

      // The following are optional, but fflate supports metadata if you want
      mtime: file.lastModified,
      filename: file.name

    }, function(err, data) {
      if (err) callback(err);
      else {
        filesLengths[file.name] = [data.length, file.size];
    
        // If you want to download the file to check it for yourself:
        // download(data, 'myFile.gz');
  
        // If everyone else has finished processing already...
        if (!--left) {
          // Then return.
          callback(prettySizes(filesLengths));
        }
      }
    });
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`,
    uzip: `var left = files.length;
var filesLengths = {};
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {

    // UZIP doesn't natively support GZIP, but I patched in support for it.
    // In other words, you're better off using fflate for GZIP.
  
    // Also, UZIP runs synchronously on the main thread. It relies on global
    // state, so you can't even run it in the background without causing bugs.
  
    // But just for the sake of a performance comparison, try it out.
    uzipWorker.gzip(buf, function(err, data) {
      if (err) callback(err);
      else {
        filesLengths[file.name] = [data.length, file.size];
        if (!--left) callback(prettySizes(filesLengths));
      }
    });
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`,
    pako: `var left = files.length;
var filesLengths = {};
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {

    // Unlike UZIP, Pako natively supports GZIP, and it doesn't rely on global
    // state. However, it's still 46kB for this basic functionality as opposed
    // to fflate's 7kB, not to mention the fact that there's no easy way to use
    // it asynchronously. I had to add a worker proxy for this to work.

    pakoWorker.gzip(buf, function(err, data) {
      if (err) callback(err)
      else {
        filesLengths[file.name] = [data.length, file.size];
        if (!--left) callback(prettySizes(filesLengths));
      }
    });
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`
  },
  'ZIP archive creation': {
    fflate: `// fflate's ZIP API is asynchronous and parallelized (multithreaded)
var left = files.length;
var zipObj = {};
var ALREADY_COMPRESSED = [
  'zip', 'gz', 'png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'ppt', 'pptx',
  'xls', 'xlsx', 'heic', 'heif', '7z', 'bz2', 'rar', 'gif', 'webp', 'webm',
  'mp4', 'mov', 'mp3', 'aifc'
];

// Yet again, this is necessary for parallelization.
var processFile = function(i) {
  var file = files[i];
  var ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
  fileToU8(file, function(buf) {
    // With fflate, we can choose which files we want to compress
    zipObj[file.name] = [buf, {
      level: ALREADY_COMPRESSED.indexOf(ext) == -1 ? 6 : 0
    }];
    
    // If we didn't want to specify options:
    // zipObj[file.name] = buf;

    if (!--left) {
      fflate.zip(zipObj, {
        // If you want to control options for every file, you can do so here
        // They are merged with the per-file options (if they exist)
        // mem: 9
      }, function(err, out) {
        if (err) callback(err);
        else {
          // You may want to try downloading to see that fflate actually works:
          // download(out, 'fflate-demo.zip');
          callback('Length ' + out.length);
        }
      });
    }
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`,
    uzip: `var left = files.length;
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {
    // With UZIP, you cannot control the compression level of a file
    // However, it skips compressing ZIP, JPEG, and PNG files out of the box.
    zipObj.add(file.name, buf);
    if (!--left) {
      zipObj.ondata = function(err, out) {
        if (err) callback(err);
        else callback('Length ' + out.length);
      }
      zipObj.end();
    }
  });
}
// Reminder that this is custom sugar
var zipObj = uzipWorker.zip();
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`,
    pako: `var left = files.length;

// Internally, this uses JSZip. Despite its clean API, it suffers from
// abysmal performance and awful compression ratios, particularly in v3.2.0
// and up.
// If you choose JSZip, make sure to use v3.1.5 for adequate performance
// (2-3x slower than fflate) instead of the latest version, which is 20-30x
// slower than fflate.

var zipObj = pakoWorker.zip();
var processFile = function(i) {
  var file = files[i];
  fileToU8(file, function(buf) {
    // With JSZip, you cannot control the compression level of a file
    zipObj.add(file.name, buf);
    if (!--left) {
      zipObj.ondata = function(err, out) {
        if (err) callback(err);
        else callback('Length ' + out.length);
      }
      zipObj.end();
    }
  });
}
for (var i = 0; i < files.length; ++i) {
  processFile(i);
}`
  }
}

if (canStream) {
  presets['Streaming GZIP compression'] = {
    fflate: `const { AsyncGzip } = fflate;
// Theoretically, you could do this on every file, but I haven't done that here
// for the sake of simplicity.
const file = files[0];
const gzipStream = new AsyncGzip({ level: 6 });
// We can stream the file through GZIP to reduce memory usage
const fakeResponse = new Response(
  file.stream().pipeThrough(toNativeStream(gzipStream))
);
fakeResponse.arrayBuffer().then(buf => {
  callback('Length ' + buf.byteLength);
});`,
    uzip: `// UZIP doesn't support streaming to any extent
callback(new Error('unsupported'));`,
    pako: `// Hundreds of lines of code to make this run on a Worker...
const file = files[0];
// In case this wasn't clear already, Pako doesn't actually support this,
// you need to create a custom async stream. I suppose you could copy the
// code used in this demo, which is on GitHub under the demo/ directory.
const gzipStream = pakoWorker.createGzip();
const fakeResponse = new Response(
  file.stream().pipeThrough(toNativeStream(gzipStream))
);
fakeResponse.arrayBuffer().then(buf => {
  callback('Length ' + buf.byteLength);
});`
  };
}

const availablePresets = Object.keys(presets);

const CodeHighlight: FC<{
  code: string;
  preset: string;
  onInput: (newCode: string) => void;
}> = ({ code, preset, onInput }) => {
  const highlight = useMemo(() => ({
    __html: Prism.highlight(code + '\n', Prism.languages.javascript, 'javascript')
  }), [code]);
  const pre = useRef<HTMLPreElement>(null);
  const ta = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    pre.current!.addEventListener('scroll', () => {
      ta.current!.scrollLeft = pre.current!.scrollLeft;
      ta.current!.style.left = pre.current!.scrollLeft + 'px';
    }, { passive: true });
    ta.current!.addEventListener('scroll', () => {
      pre.current!.scrollLeft = ta.current!.scrollLeft;
    }, { passive: true });
  }, []);
  useEffect(() => {
    ta.current!.value = code;
  }, [preset]);
  return (
    <pre ref={pre} style={{
      position: 'relative',
      backgroundColor: '#2a2734',
      color: '#9a86fd',
      maxWidth: 'calc(90vw - 2em)',
      fontSize: '0.7em',
      marginTop: '1em',
      marginBottom: '1em',
      padding: '1em',
      overflow: 'auto',
      fontFamily: 'Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace'
    }}>
      <div dangerouslySetInnerHTML={highlight} />
      <textarea
        ref={ta}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        style={{
          border: 0,
          resize: 'none',
          outline: 'none',
          position: 'absolute',
          background: 'transparent',
          whiteSpace: 'pre',
          top: 0,
          left: 0,
          width: 'calc(100% - 1em)',
          height: 'calc(100% - 2em)',
          overflow: 'hidden',
          lineHeight: 'inherit',
          fontSize: 'inherit',
          padding: 'inherit',
          paddingRight: 0,
          color: 'transparent',
          caretColor: 'white',
          fontFamily: 'inherit'
        }}
        onKeyDown={e => {
          const t = e.currentTarget;
          let val = t.value;
          const loc = t.selectionStart;
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
            t.value = val += tail;
            t.selectionStart = t.selectionEnd = loc + indent + 1;
            ta.current!.scrollLeft = 0;
          } else if (e.key == 'Tab') {
            t.value = val = val.slice(0, loc) + '  ' + val.slice(t.selectionEnd);
            t.selectionStart = t.selectionEnd = loc + 2;
          } else if (t.selectionStart == t.selectionEnd) {
            if (e.key == 'Backspace') {
              if (val.charCodeAt(loc - 1) == 32 && !val.slice(val.lastIndexOf('\n', loc - 1), loc).trim().length) {
                t.value = val.slice(0, loc - 1) + val.slice(loc);
                t.selectionStart = t.selectionEnd = loc - 1;
              } else if (
                (val.charAt(loc - 1) == '{' && val.charAt(loc) == '}') ||
                (val.charAt(loc - 1) == '[' && val.charAt(loc) == ']') ||
                (val.charAt(loc - 1) == '(' && val.charAt(loc) == ')')
              ) {
                t.value = val.slice(0, loc) + val.slice(loc + 1);
                // hack, doesn't work always
                t.selectionStart = t.selectionEnd = loc;
              }
              return;
            } else {
              switch(e.key) {
                case '{':
                case '[':
                case '(':
                  t.value = val = val.slice(0, loc) + (e.key == '{' ? '}' : e.key == '[' ? ']' : ')') + val.slice(loc);
                  t.selectionStart = t.selectionEnd = loc;
                  break;
                case '}':
                case ']':
                case ')':
                  // BUG: if the cursor is moved, this false activates
                  if (e.key == val.charAt(loc)) {
                    t.value = val.slice(0, loc) + val.slice(loc + 1);
                    t.selectionStart = t.selectionEnd = loc;
                  } else {
                    const lastNL = val.lastIndexOf('\n', loc - 1);
                    const sl = val.slice(lastNL, loc);
                    const o = loc - (sl.length > 1 && !sl.trim().length ? 2 : 0);
                    t.value = val.slice(0, o) + val.slice(loc);
                    t.selectionStart = t.selectionEnd = o;
                  }
              }
              return;
            };
          } else return;
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

const CodeBox: FC<{files: File[]; forwardRef: Ref<HTMLDivElement>}> = ({ files, forwardRef }) => {
  const [preset, setPreset] = useState('Basic GZIP compression');
  const [{ fflate, uzip, pako }, setCodes] = useState(presets[preset]);
  const [ffl, setFFL] = useState('');
  const [uz, setUZ] = useState('');
  const [pk, setPK] = useState('');
  useEffect(() => {
    if (!files) {
      setFFL('');
      setUZ('');
      setPK('');
    }
  }, [files]);
  const onInput = (lib: 'fflate' | 'uzip' | 'pako', code: string) => {
    const codes: Preset = {
      fflate,
      uzip,
      pako
    };
    codes[lib] = code;
    setCodes(codes);
    setPreset('Custom');
  }
  const [hover, setHover] = useState(false);
  return (
    <div ref={forwardRef} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      flexWrap: 'wrap'
    }}>
      <div>
      <label>Preset: </label>
        <select value={preset} onChange={e => {
          let newPreset = e.currentTarget.value;
          if (newPreset != 'Custom') setCodes(presets[newPreset]);
          setPreset(newPreset);
        }} style={{
          marginTop: '2em'
        }}>
          {availablePresets.map(preset => <option key={preset} value={preset}>{preset}</option>)}
          <option value="Custom">Custom</option>
        </select>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        whiteSpace: 'pre-wrap',
        textAlign: 'left',
        flexWrap: 'wrap'
      }}>
        <div style={{ padding: '2vmin' }}>
          fflate:
          <CodeHighlight code={fflate} preset={preset} onInput={t => onInput('fflate', t)} />
          <span dangerouslySetInnerHTML={{ __html: ffl }} />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}>
          <div style={{ padding: '2vmin' }}>
            UZIP (shimmed):
            <CodeHighlight code={uzip} preset={preset} onInput={t => onInput('uzip', t)} />
            <span dangerouslySetInnerHTML={{ __html: uz }} />
          </div>
          <div style={{ padding: '2vmin' }}>
            Pako (shimmed):
            <CodeHighlight code={pako} preset={preset} onInput={t => onInput('pako', t)} />
            <span dangerouslySetInnerHTML={{ __html: pk }} />
          </div>
        </div>
      </div>
      <button disabled={pk == 'Waiting...' || pk == 'Running...'} style={{
        cursor: 'default',
        width: '20vmin',
        height: '6vh',
        fontSize: '1.25em',
        margin: '1vmin',
        padding: '1vmin',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px 1px rgba(0, 0, 0, 0.2), 0 2px 4px 2px rgba(0, 0, 0, 0.15), 0 4px 8px 4px rgba(0, 0, 0, 0.12)',
        border: '1px solid black',
        borderRadius: '6px',
        transition: 'background-color 300ms ease-in-out',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        MozUserSelect: 'none',
        userSelect: 'none',
        outline: 'none',
        backgroundColor: hover ? 'rgba(0, 0, 0, 0.2)' : 'white'
      }} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => {
        setHover(false);
        const ts = tm();
        setFFL(rn);
        setUZ(wt);
        setPK(wt);
        exec(fflate, files, out => {
          const tf = tm();
          setFFL('Finished in <span style="font-weight:bold">' + (tf - ts).toFixed(3) + 'ms</span>: ' + out);
          exec(uzip, files, out => {
            const tu = tm();
            setUZ('Finished in <span style="font-weight:bold">' + (tu - tf).toFixed(3) + 'ms:</span> ' + out);
            exec(pako, files, out => {
              setPK('Finished in <span style="font-weight:bold">' + (tm() - tu).toFixed(3) + 'ms:</span> ' + out);
            });
          });
        });
      }}>Run</button>
    </div>
  ); 
}

export default CodeBox;