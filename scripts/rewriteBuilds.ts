import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
for (const d of ['lib', 'esm']) {
  const f = join(__dirname, '..', d, 'index.js');
  writeFileSync(f, readFileSync(f, 'utf-8').replace(/\/\*\* \@class \*\//g, '/*#__PURE__*/'));
}
