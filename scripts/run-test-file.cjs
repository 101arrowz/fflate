const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
if (!args.length) {
  throw new Error('Usage: node scripts/run-test-file.cjs <test-file.ts>');
}

const env = {
  ...process.env,
  TS_NODE_PROJECT: 'test/tsconfig.json',
  TS_NODE_TRANSPILE_ONLY: '1'
};

const result = spawnSync(process.execPath, ['-r', 'ts-node/register', ...args], {
  stdio: 'inherit',
  env
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
