import React, { FC } from 'react';
import FilePicker from './components/file-picker';

const App: FC = () => {
  return (
    <div>
      <FilePicker onFiles={f => {
        console.log(f);
      }} onError={console.log} onDrag={() => {}}>Hi</FilePicker>
    </div>
  );
}

export default App;