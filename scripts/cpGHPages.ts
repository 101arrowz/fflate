import * as createGit from 'simple-git/promise';
import { resolve, join } from 'path';
import { copyFileSync, readdirSync, statSync, unlinkSync } from 'fs';

const baseDir = resolve(__dirname, '..');
const to = (...paths: string[]) => join(baseDir, ...paths);
const git = createGit();
git.log({
  from: 'HEAD~1',
  to: 'HEAD'
}).then(async log => {
  const hash = log.latest.hash.slice(0, 7);
  await git.checkout('gh-pages');
  for (const f of readdirSync(to('.'))) {
    if (statSync(f).isFile())
      unlinkSync(to(f));
  }
  const files = readdirSync(to('dist'))
  for (const f of files) {
    copyFileSync(to('dist', f), to(f));
  }
  await git.add(files);
  await git.commit('Build demo from ' + hash);
  await git.checkout('master');
});