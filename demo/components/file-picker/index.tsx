import React, { CSSProperties, FC, HTMLAttributes, InputHTMLAttributes, useEffect, useRef, useState } from 'react';

const supportsInputDirs = 'webkitdirectory' in HTMLInputElement.prototype;
const supportsRelativePath = 'webkitRelativePath' in File.prototype;
const supportsDirs = typeof DataTransferItem != 'undefined' && 'webkitGetAsEntry' in DataTransferItem.prototype;

const readRecurse = (dir: FileSystemDirectoryEntry, onComplete: (files: File[]) => void, onError: (err: Error) => void) => {
  let files: File[] = [];
  let total = 0;
  let errored = false;
  let reachedEnd = false;
  const onErr = (err: Error) => {
    if (!errored) {
      errored = true;
      onError(err);
    }
  };
  const onDone = (f: File[]) => {
    files = files.concat(f);
    if (!--total && reachedEnd) onComplete(files);
  };
  const reader = dir.createReader();
  const onRead = (entries: FileSystemEntry[]) => {
    if (!entries.length && !errored) {
      if (!total) onComplete(files);
      else reachedEnd = true;
    } else reader.readEntries(onRead, onError);
    for (const entry of entries) {
      ++total;
      if (entry.isFile) entry.file(f => onDone([
        new File([f], entry.fullPath.slice(1), f)
      ]), onErr);
      else readRecurse(entry as FileSystemDirectoryEntry, onDone, onErr);
    }
  };
  reader.readEntries(onRead, onError);
}

const FilePicker: FC<{
  onFiles(files: File[] | null): void;
  onDrag(on: boolean): void;
  onError(err: string | Error): void;
  allowDirs: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'onError'>
> = ({ onFiles, onDrag, onError, style, allowDirs, children, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef(0);
  const [inputHover, setInputHover] = useState(false);
  const [dirInputHover, setDirInputHover] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    // only init'd when support dirs
    if (dirInputRef.current) {
      dirInputRef.current.setAttribute('webkitdirectory', '');
    }
  }, []);
  const rootProps: HTMLAttributes<HTMLDivElement> = {
    onDrop(ev) {
      ev.preventDefault();
      const tf = ev.dataTransfer;
      if (!tf.files.length) onError('Please drop some files in');
      else {
        onFiles(null);
        if (supportsDirs && allowDirs) {
          let outFiles: File[] = [];
          let lft = tf.items.length;
          let errored = false;
          const onErr = (err: Error) => {
            if (!errored) {
              errored = true;
              onError(err);
            }
          }
          const onDone = (f: File[]) => {
            outFiles = outFiles.concat(f);
            if (!--lft && !errored) onFiles(outFiles);
          };
          for (let i = 0; i < tf.items.length; ++i) {
            const entry = tf.items[i].webkitGetAsEntry();
            if (entry.isFile) entry.file(f => onDone([f]), onErr);
            else readRecurse(entry as FileSystemDirectoryEntry, onDone, onErr);
          }
        } else onFiles(Array.prototype.slice.call(tf.files));
      }
      setIsHovering(false);
    },
    onDragEnter() {
      ++dragRef.current;
      onDrag(true);
      setIsHovering(true);
    },
    onDragOver(ev) {
      ev.preventDefault();
    },
    onDragLeave() {
      if (!--dragRef.current) {
        onDrag(false);  
        setIsHovering(false);
      }
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...style
    }
  };
  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    onInput(ev) {
      const t = ev.currentTarget, files = t.files!;
      if (supportsRelativePath) {
        const outFiles: File[] = Array(files.length);
        for (let i = 0; i < files.length; ++i) {
          const file = files[i];
          outFiles[i] = new File([file], file.webkitRelativePath || file.name, file);
        }
        onFiles(outFiles);
      } else onFiles(Array.prototype.slice.call(files));
      t.value = '';
    },
    style: { display: 'none' },
    multiple: true
  };
  const buttonStyles: CSSProperties = {
    cursor: 'default',
    minWidth: '8vw',
    height: '6vh',
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
    userSelect: 'none'
  };
  return (
    <div {...props} {...rootProps}>
      {children}
      <div style={{
        transition: 'transform ' + (isHovering ? 300 : 50) + 'ms ease-in-out',
        transform: isHovering ? 'scale(1.5)' : 'none'
      }}>Drag and Drop</div>
      <div style={{
        borderBottom: '1px solid gray',
        margin: '1.5vh',
        color: 'gray',
        lineHeight: 0,
        paddingTop: '1.5vh',
        marginBottom: '3vh',
        width: '100%',
      }}>
        <span style={{ background: 'white', padding: '0.25em' }}>OR</span>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}>
        <input type="file" ref={inputRef} {...inputProps} />
        <div onClick={() => inputRef.current!.click()} onMouseOver={() => setInputHover(true)} onMouseOut={() => setInputHover(false)} style={{
          ...buttonStyles,
          backgroundColor: inputHover ? 'rgba(0, 0, 0, 0.14)' : 'white'
        }}>Select Files</div>
        {supportsInputDirs && allowDirs &&
          <>
            <div style={{ boxShadow: '1px 0 black', height: '100%' }}><span /></div>
            <input type="file" ref={dirInputRef} {...inputProps} />
            <div onClick={() => dirInputRef.current!.click()} onMouseOver={() => setDirInputHover(true)} onMouseOut={() => setDirInputHover(false)} style={{
              ...buttonStyles,
              marginLeft: '8vmin',
              backgroundColor: dirInputHover ? 'rgba(0, 0, 0, 0.14)' : 'white'
            }}>Select Folders</div>
          </>
        }
      </div>
    </div>
  );
}

export default FilePicker;