import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import sh from 'shelljs';
import { fileURLToPath } from 'url';
import yargs from 'yargs';

// ShellJS should exit if a command fails.
sh.set('-e');

/** Name of the Bazel tag that will be used to find release package targets. */
const releaseTargetTag = 'release-package';

/** Path to the project directory. */
const projectDir = join(dirname(fileURLToPath(import.meta.url)), '../');

/** path to the release directory. */
const releaseDir = join(projectDir, 'dist/releases');

/** Command that runs Bazel. */
const bazelCmd = process.env.BAZEL_COMMAND || `pnpm -s bazel`;

if (process.argv.length === 3) {
  yargs(process.argv.slice(2))
    .default(process.argv.slice(2))
    .command({
      command: 'all',
      describe: 'Build all bazel targets',
      handler: retry(() => buildAllTargets()),
    })
    .command({
      command: 'packages',
      describe: 'Build release packages',
      handler: () => buildReleasePackages(releaseDir),
    })
    .command({
      command: 'i18n',
      describe: 'Generate i18n files',
      handler: () => buildI18n(releaseDir, join(projectDir, 'src/angular/i18n')),
    })
    .command({
      command: 'docs',
      describe: 'Build docs',
      handler: () => buildDocs(join(projectDir, 'dist/docs')),
    })
    .strict()
    .parseSync();

  function retry<T>(action: () => T) {
    // TODO: Figure out why this is even necessary.
    return () => {
      try {
        return action();
      } catch (e) {
        console.log('Action failed once. Retrying...');
        return action();
      }
    };
  }
}

/**
 * Builds all available targets, except the release packages and the prod showcase.
 */
function buildAllTargets() {
  exec(`${bazelCmd} build src/... --build_tag_filters=-release-package,-prod-showcase`);
}

/**
 * Builds the release packages with the given compile mode and copies
 * the package output into the given directory.
 */
function buildReleasePackages(distPath: string) {
  console.log('######################################');
  console.log('  Building release packages...');
  console.log('######################################');

  /** Command that queries Bazel for all release package targets. */
  const queryPackagesCmd =
    `${bazelCmd} query --output=label "filter(':npm_package$', ` +
    `attr('tags', '\\[.*${releaseTargetTag}.*\\]', //src/...))"`;

  // List of targets to build. e.g. "src/angular:npm_package"
  const targets = exec(queryPackagesCmd, true).split(/\r?\n/);
  const packageNames = getPackageNamesOfTargets(targets);
  const bazelBinPath = exec(`${bazelCmd} info bazel-bin`, true);
  const getOutputPath = (pkgName: string) => join(bazelBinPath, 'src', pkgName, 'npm_package');

  // Build with "--config=release" so that Bazel runs the workspace stamping script. The
  // stamping script ensures that the version placeholder is populated in the release output.
  exec(`${bazelCmd} build --config=release ${targets.join(' ')}`);

  cleanDistPath(distPath);

  // Copy the package output into the specified distribution folder.
  packageNames.forEach((pkgName) => {
    const outputPath = getOutputPath(pkgName);
    const targetFolder = join(distPath, pkgName);
    copyPackageOutput(outputPath, targetFolder);
  });
}

/**
 * Gets the package names of the specified Bazel targets.
 * e.g. //src/angular:npm_package -> angular
 */
function getPackageNamesOfTargets(targets: string[]) {
  const seen = new Set<string>();

  for (const targetName of targets) {
    const match = targetName.match(/\/\/src\/(.*):npm_package/)?.[1];

    if (!match) {
      throw new Error(
        `Found Bazel target with "${releaseTargetTag}" tag, but could not ` +
          `determine release output name: ${targetName}`,
      );
    }

    if (seen.has(match)) {
      throw new Error(
        `Detected duplicate package "${match}". The duplication can cause issues when publishing ` +
          `to npm and needs to be resolved.`,
      );
    }

    seen.add(match);
  }

  return Array.from(seen);
}

function buildI18n(distPath: string, i18nDistPath: string) {
  buildReleasePackages(distPath);
  for (const format of ['xlf', 'xlf2']) {
    const relativeDistPath = relative(projectDir, distPath);
    const outPath = join(i18nDistPath, format, 'messages.xlf');
    exec(
      `"node_modules/.bin/localize-extract" -l en-CH -s "${relativeDistPath}/**/fesm2022/*.mjs" -f ${format} -o "${outPath}"`,
    );

    const content = readFileSync(outPath, 'utf8');
    const newContent = content.replace(
      /(context-type="sourcefile"|category="location")>(\.\.\/)+[^\/]+\/bin\/src\/angular\//g,
      (_, m) => `${m}>../../`,
    );
    writeFileSync(outPath, newContent, 'utf8');

    console.log(`Updated ${relative(projectDir, outPath)}`);
  }
}

/**
 * Builds docs with ivy and copies the package output into the given directory.
 */
function buildDocs(targetFolder: string) {
  console.log('######################################');
  console.log('  Building docs...');
  console.log('######################################');

  exec(`${bazelCmd} build //docs:build.production`);

  cleanDistPath(targetFolder);
  const bazelBinPath = exec(`${bazelCmd} info bazel-bin`, true);
  const outputPath = join(bazelBinPath, 'docs/dist/browser/');
  copyPackageOutput(outputPath, targetFolder);
}

/**
 * Delete the distribution directory so that the output is guaranteed to be clean. Re-create
 * the empty directory so that we can copy the release packages into it later.
 */
function cleanDistPath(distPath: string) {
  sh.rm('-rf', distPath);
  sh.mkdir('-p', distPath);
}

/**
 * Copy the package output into the specified distribution folder.
 */
function copyPackageOutput(outputPath: string, targetFolder: string) {
  console.log(`> Copying package output to "${targetFolder}" (from "${outputPath}")`);
  sh.cp('-R', outputPath, targetFolder);
  sh.chmod('-R', 'u+w', targetFolder);
}

/**
 * Executes the given command in the project directory.
 * @param command The command to run
 * @param captureStdout Whether the stdout should be captured and
 *   returned.
 */
function exec(command: string): void;
function exec(command: string, captureStdout: true): string;
function exec(command: string, captureStdout = false) {
  const stdout = execSync(command, {
    cwd: projectDir,
    stdio: ['inherit', captureStdout ? 'pipe' : 'inherit', 'inherit'],
  });

  if (captureStdout) {
    process.stdout.write(stdout);
    return stdout.toString().trim();
  }
}
