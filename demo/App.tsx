import React, { FC, useEffect, useRef, useState } from 'react';
import FilePicker from './components/file-picker';
import CodeBox from './components/code-box';

const App: FC = () => {
  const [err, setErr] = useState<string | Error | null>(null);
  const [files, setFiles] = useState<File[] | null>([]);
  const cbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (files && files.length) {
      cbRef.current!.scrollIntoView({
        behavior: 'smooth' // Hopefully IE just ignores this value
      });
    }
  }, [files]);
  return (
    <>
      <div style={{
        display: 'flex',
        fontSize: '70px',
        justifyContent: 'space-between',
        flexDirection: 'row',
        overflow: 'hidden',
        width: '100%',
        fontWeight: 'bold'
      }}>
        <div style={{ paddingLeft: '0.25em' }}>
          fflate
          <div style={{
            color: 'gray',
            fontSize: '0.25em',
            fontWeight: 'lighter'
          }}>a fast compression library by <a href="//github.com/101arrowz" style={{ color: 'gray' }}>101arrowz</a></div>
        </div>
        <a href="//github.com/101arrowz/fflate">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 250 250" fill="white">
            <path d="M0 0l115 115h15l12 27 108 108V0z" fill="black"/>
            <path d="M128 109c-15-9-9-19-9-19 3-7 2-11 2-11-1-7 3-2 3-2 4 5 2 11 2 11-3 10 5 15 9 16" style={{ transformOrigin: '130px 106px' }} />
            <path d="M115 115s4 2 5 0l14-14c3-2 6-3 8-3-8-11-15-24 2-41 5-5 10-7 16-7 1-2 3-7 12-11 0 0 5 3 7 16 4 2 8 5 12 9s7 8 9 12c14 3 17 7 17 7-4 8-9 11-11 11 0 6-2 11-7 16-16 16-30 10-41 2 0 3-1 7-5 11l-12 11c-1 1 1 5 1 5z"/>
          </svg>
        </a>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        width: '100%',
        flex: 1
      }}>
        <div style={{ maxWidth: '80%', fontSize: 'calc(15px + 0.6vw)', paddingTop: '4vh', paddingBottom: '2vh' }}>
          You've found <a href="//npmjs.com/package/fflate">fflate</a>, the fastest pure JavaScript compression library in existence.
          <br /><br />
          You can both pack and expand Zlib, GZIP, DEFLATE, or ZIP files very quickly with just a few lines of code.
          <br /><br />
          Weighing in at a measly 8kB for basic compression and decompression, you don't need to worry about your bundle size ballooning.
          <br /><br />
          Despite utilizing multiple cores, supporting data streams, and being very memory efficient, fflate is compatible with both Node.js and browsers as old as IE11.
          <br /><br />
          You can read more about fflate on <a href="//github.com/101arrowz/fflate">GitHub</a>. Try the demo below to see its performance for yourself. The code boxes are editable; try changing parameters or using a different compression format.
          <br /><br />
          <span style={{ fontSize: '0.75em' }}>Disclaimer: I added a <span style={{ fontStyle: 'italic' }}>lot</span> of sugar (around 4 hundred lines) to the UZIP and Pako APIs to make the demo clean and asynchronous, but the fflate API is unmodified.</span>
          <br /><br />
        </div>
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          marginBottom: '2vh'
        }}>
          <FilePicker allowDirs onFiles={setFiles} onError={setErr} onDrag={() => {}}>
            {err && <div style={{ color: 'red' }}>Error: {err}</div>}
            <div>{files ? ((files.length || 'No') + ' file' + (files.length == 1 ? '' : 's') + ' selected') : 'Loading...'}</div>
            <br />
          </FilePicker>
          {((!files || files.length) && <CodeBox files={files!} forwardRef={cbRef} />) || null}
        </div>
       </div>
    </>
  );
}

export default App;