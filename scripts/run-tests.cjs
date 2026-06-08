const { spawnSync } = require('node:child_process');
const path = require('node:path');

const args = process.argv.slice(2);
const uvuBin = path.join(__dirname, '..', 'node_modules', 'uvu', 'bin.js');
const env = {
  ...process.env,
  TS_NODE_PROJECT: 'test/tsconfig.json',
  TS_NODE_TRANSPILE_ONLY: '1'
};

const result = spawnSync(process.execPath, [uvuBin, '-b', '-r', 'ts-node/register', ...(args.length ? args : ['test'])], {
  stdio: 'inherit',
  env
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
