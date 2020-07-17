#!/usr/bin/env node

/**
 * Script that builds the icon cdn registry schematic and generates the icon registry
 * in src/angular-core/icons.
 */

const { execSync } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { join, relative } = require('path');
const prettier = require('prettier');
const { chmod, cp, mkdir, rm, set } = require('shelljs');

// ShellJS should exit if a command fails.
set('-e');

/** Path to the project directory. */
const projectDir = join(__dirname, '../');

/** Command that runs Bazel. */
const bazelCmd = process.env.BAZEL_COMMAND || `yarn -s bazel`;

if (module === require.main) {
  generateIconRegistry(join(projectDir, 'dist/staged'));
}

function generateIconRegistry(distPath) {
  const bazelBinPath = exec(`${bazelCmd} info bazel-bin`, true);

  exec(`${bazelCmd} build src/angular-core:npm_package`);

  // Delete the distribution directory so that the output is guaranteed to be clean. Re-create
  // the empty directory so that we can copy the release packages into it later.
  rm('-rf', distPath);
  mkdir('-p', distPath);

  // Copy the package output into the specified distribution folder.
  const outputPath = join(bazelBinPath, 'src/angular-core/npm_package');
  const targetFolder = join(distPath, 'angular-core');
  console.log(`> Copying package output to "${targetFolder}" (from "${outputPath}")`);
  cp('-R', outputPath, targetFolder);
  chmod('-R', 'u+w', targetFolder);

  const schematicPath = `./${relative(projectDir, targetFolder).replace(/\\/g, '/')}`;
  exec(`yarn ng generate ${schematicPath}:icon-cdn-provider --path src/angular-core/icon`);

  replaceIconImport();
}

/**
 * Executes the given command in the project directory.
 * @param {string} command The command to run
 * @param {boolean=} captureStdout Whether the stdout should be captured and
 *   returned.
 */
function exec(command, captureStdout) {
  const stdout = execSync(command, {
    cwd: projectDir,
    stdio: ['inherit', captureStdout ? 'pipe' : 'inherit', 'inherit'],
  });

  if (captureStdout) {
    process.stdout.write(stdout);
    return stdout.toString().trim();
  }
}

function replaceIconImport() {
  const cdnIconProviderPath = join(projectDir, 'src/angular-core/icon/icon-cdn-provider.ts');

  const content = readFileSync(cdnIconProviderPath, 'utf8').replace(
    `import { SbbIconRegistry } from '@sbb-esta/angular-core/icon';`,
    `\nimport { SbbIconRegistry } from './icon-registry';`
  );

  const formattedContent = prettier.format(content, {
    parser: 'typescript',
    ...require('../package.json').prettier,
  });

  writeFileSync(cdnIconProviderPath, formattedContent, 'utf8');
}
