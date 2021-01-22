import { readFileSync, writeFileSync, unlinkSync, renameSync } from 'fs';
import { join } from 'path';
const atClass = /\/\*\* \@class \*\//g, pure = '/*#__PURE__*/';
const extraneousExports = /exports\.(.*) = void 0;\n/;
const libDir = join(__dirname, '..', 'lib');
const libIndex = join(libDir, 'index.js');
const lib = readFileSync(libIndex, 'utf-8').replace(atClass, pure).replace(extraneousExports, '');

writeFileSync(libIndex, lib);
const esmDir = join(__dirname, '..', 'esm');
const esmIndex = join(esmDir, 'index.js'),
      esmWK = join(esmDir, 'worker.js'),
      esmNWK = join(esmDir, 'node-worker.js');
const esm = readFileSync(esmIndex, 'utf-8').replace(atClass, pure);
const wk = readFileSync(esmWK, 'utf-8'),
      nwk = readFileSync(esmNWK, 'utf-8');
unlinkSync(esmIndex), unlinkSync(esmWK), unlinkSync(esmNWK), unlinkSync(libIndex);
renameSync(join(libDir, 'worker.js'), join(libDir, 'worker.cjs'));
renameSync(join(libDir, 'node-worker.js'), join(libDir, 'node-worker.cjs'));
unlinkSync(join(libDir, 'worker.d.ts')), unlinkSync(join(libDir, 'node-worker.d.ts'));
const workerImport = /import (.*) from '\.\/node-worker';/;
const workerRequire = /var (.*) = require\("\.\/node-worker"\);/;
const defaultExport = /export default/;
writeFileSync(join(esmDir, 'index.mjs'), esm.replace(workerImport, name => nwk.replace(defaultExport, `var ${name.slice(7, name.indexOf(' ', 8))} =`)));
writeFileSync(join(esmDir, 'browser.js'), esm.replace(workerImport, name => wk.replace(defaultExport, `var ${name.slice(7, name.indexOf(' ', 8))} =`)));
writeFileSync(join(libDir, 'node.cjs'), lib.replace(workerRequire, name => nwk.replace(defaultExport, `var ${name.slice(4, name.indexOf(' ', 5))} =`)));
writeFileSync(join(libDir, 'browser.cjs'), lib.replace(workerRequire, name => wk.replace(defaultExport, `var ${name.slice(4, name.indexOf(' ', 5))} =`)));
writeFileSync(join(libDir, 'index.cjs'), lib.replace(workerRequire, name => `var ${name.slice(4, name.indexOf(' ', 5))} = require("./node-worker.cjs");`));