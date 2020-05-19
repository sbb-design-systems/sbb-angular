const { compilerOptions } = require('../schematics/tsconfig.json');

require('ts-node').register({
  typeCheck: true,
  compilerOptions: { ...compilerOptions, module: 'commonjs' },
});
