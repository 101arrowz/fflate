import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { minify, MinifyOptions } from 'terser';
import { join } from 'path';

const p = (...fns: string[]) => join(__dirname, '..', ...fns);

const src = readFileSync(p('lib', 'index.js'), 'utf8');
const worker = readFileSync(p('lib', 'worker.js'), 'utf8');
const nodeWorker = readFileSync(p('lib', 'node-worker.js'), 'utf8');

const opts: MinifyOptions = {
  mangle: {
    toplevel: true,
  },
  compress: {
    passes: 5,
    unsafe: true,
    pure_getters: true
  },
  sourceMap: false
};

minify(src, opts).then(async out => {
  const wkrOut = (await minify(worker, opts)).code!.replace(
    /exports.__esModule=!0;/,
    ''
  ).replace(/exports\./g, '_f.');
  const nodeWkrOut = (await minify(nodeWorker, opts)).code!.replace(
    /exports.__esModule=!0;/,
    ''
  ).replace(/exports\./g, '_f.').replace(
    /require/, // intentionally done just once
    "eval('require')"
  );
  const res = "!function(f){typeof module!='undefined'&&typeof exports=='object'?module.exports=f():typeof define!='undefined'&&define.amd?define(['fflate',f]):(typeof self!='undefined'?self:this).fflate=f()}(function(){var _e={};" +
    out.code!.replace(/exports\.(.*)=void 0;/, '').replace(/exports\./g, '_e.').replace(/require\("\.\/node-worker"\)/,
    "(typeof module!='undefined'&&typeof exports=='object'?function(_f){" + nodeWkrOut + 'return _f}:function(_f){' + wkrOut + 'return _f})({})'
  ) + 'return _e})';
  if (!existsSync(p('umd'))) mkdirSync(p('umd'));
  writeFileSync(p('umd', 'index.js'), res);
});