#!/usr/bin/env node

/**
 * Script that builds the showcase output and copies the output to the
 * distribution folder within the project.
 */

const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const { join } = require('path');
const { chmod, cp, mkdir, rm, set } = require('shelljs');

// ShellJS should exit if a command fails.
set('-e');

/** Path to the project directory. */
const projectDir = join(__dirname, '../');

/** Command that runs Bazel. */
const bazelCmd = process.env.BAZEL_COMMAND || `yarn -s bazel`;

if (module === require.main) {
  buildShowcase(join(projectDir, 'dist/releases'));
}

function buildShowcase(distPath) {
  console.log('######################################');
  console.log('  Building showcase...');
  console.log('######################################');

  const pkgName = 'showcase';
  const bazelBinPath = exec(`${bazelCmd} info bazel-bin`, true);
  const outputPath = join(bazelBinPath, 'src', pkgName, 'prodapp');

  exec(`${bazelCmd} build --config=release src/${pkgName}:prodapp`);

  // Delete the distribution directory so that the output is guaranteed to be clean. Re-create
  // the empty directory so that we can copy the release packages into it later.
  rm('-rf', distPath);
  mkdir('-p', distPath);

  // Copy the package output into the specified distribution folder.
  const targetFolder = join(distPath, pkgName);
  console.log(`> Copying package output to "${targetFolder}"`);
  cp('-R', outputPath, targetFolder);
  chmod('-R', 'u+w', targetFolder);

  // TODO: Remove once dockerized
  // Create package.json
  const { version } = require('../package.json');
  writeFileSync(
    join(targetFolder, 'package.json'),
    JSON.stringify({
      name: '@sbb-esta/angular-showcase',
      version,
      publishConfig: { access: 'public' }
    }),
    'utf8'
  );
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
    stdio: ['inherit', captureStdout ? 'pipe' : 'inherit', 'inherit']
  });

  if (captureStdout) {
    process.stdout.write(stdout);
    return stdout.toString().trim();
  }
}
