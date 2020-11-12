import React, { FC } from 'react';
import streamify from './stream-adapter';

const canStream = 'stream' in File.prototype;

type Preset = {
  fflate: string;
  uzip: string;
  jszip: string;
};

const presets: Record<string, string> = {
  
}