import React, { CSSProperties, FC, HTMLAttributes, InputHTMLAttributes, useEffect, useRef } from 'react';

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
  onFiles(files: File[]): void;
  onDrag(on: boolean): void;
  onError(err: string | Error): void;
  allowDirs: boolean;
} & HTMLAttributes<HTMLDivElement>
> = ({ onFiles, onDrag, onError, style, allowDirs, children, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);
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
    },
    onDragEnter() {
      onDrag(true);
    },
    onDragOver(ev) {
      ev.preventDefault();
    },
    onDragExit() {
      onDrag(false);
    },
    style: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'spac',
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
          outFiles[i] = new File([file], file.webkitRelativePath, file);
        }
        onFiles(outFiles);
      } else onFiles(Array.prototype.slice.call(files));
      t.value = '';
    },
    style: { display: 'none' },
    multiple: true
  };
  const buttonStyles: CSSProperties = {
    cursor: 'grab'
  };
  return (
    <div {...props} {...rootProps}>
      {children}
      <input type="file" ref={inputRef} {...inputProps} />
      <div onClick={() => inputRef.current!.click()} style={buttonStyles}>Files</div>
      {supportsInputDirs && allowDirs &&
        <>
          <div style={{
            borderLeft: '1px solid gray',
            color: 'gray',
            marginLeft: '2vw',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ position: 'relative', left: '-1vw', background: 'white' }}>OR</span>
          </div>
          <input type="file" ref={dirInputRef} {...inputProps} />
          <div onClick={() => dirInputRef.current!.click()} style={buttonStyles}>Folders</div>
        </>
      }
    </div>
  );
}

export default FilePicker;