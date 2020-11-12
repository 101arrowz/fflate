import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
const atClass = /\/\*\* \@class \*\//g, pure = '/*#__PURE__*/';
const libDir = join(__dirname, '..', 'lib');
const libIndex = join(libDir, 'index.js');
writeFileSync(libIndex, readFileSync(libIndex, 'utf-8').replace(atClass, pure));
const esmDir = join(__dirname, '..', 'esm');
const esmIndex = join(esmDir, 'index.js'),
      esmWK = join(esmDir, 'worker.js'),
      esmNWK = join(esmDir, 'node-worker.js');
const esm = readFileSync(esmIndex, 'utf-8').replace(atClass, pure);
const wk = readFileSync(esmWK, 'utf-8'),
      nwk = readFileSync(esmNWK, 'utf-8');
unlinkSync(esmIndex), unlinkSync(esmWK), unlinkSync(esmNWK);
unlinkSync(join(libDir, 'worker.d.ts')), unlinkSync(join(libDir, 'node-worker.d.ts'));
const workerImport = /import wk from '\.\/node-worker';/;
const defaultExport = /export default/;
const constDecl = 'var wk =';
writeFileSync(join(esmDir, 'index.mjs'), esm.replace(workerImport, nwk.replace(defaultExport, constDecl)));
writeFileSync(join(esmDir, 'browser.js'), esm.replace(workerImport, wk.replace(defaultExport, constDecl)));