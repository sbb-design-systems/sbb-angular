import * as worker from '@bazel/worker';
import * as fs from 'fs';
import * as path from 'path';
import { compile, OutputStyle } from 'sass';
import type yargs from 'yargs';

import { createLocalSbbAngularPackageImporter } from './local-sass-importer';

const workerArgs = process.argv.slice(2);

// Note: This path is relative to the current working directory as build actions
// are always spawned in the execroot (which is exactly what we want).
const execrootProjectDir = path.resolve('./src/');
const localPackageSassImporter = createLocalSbbAngularPackageImporter(execrootProjectDir);

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
}

async function main() {
  if (worker.runAsWorker(workerArgs)) {
    await worker.runWorkerLoop((args) =>
      processBuildAction(args)
        .then(() => true)
        .catch((error) => {
          worker.log(error);
          return false;
        }),
    );
  } else {
    // For non-worker mode, we parse the flag/params file ourselves. The Sass rule
    // uses a multi-line params file (with `\n` used as separator).
    const configFile = workerArgs[0].replace(/^@+/, '');
    const configContent = fs.readFileSync(configFile, 'utf8').trim();
    const args = configContent.split('\n');

    await processBuildAction(args);
  }
}

/**
 * Processes a build action expressed through command line arguments
 * as composed by the `sass_binary` rule.
 */
async function processBuildAction(args: string[]) {
  // TODO: Ugly solution to achieve a dynamic import to force esm usage. Replace with esm when possible.
  const yargsi = await (Function(`return import('yargs')`)() as Promise<{ default: typeof yargs }>);

  const { loadPath, style, sourceMap, embedSources, inputExecpath, outExecpath } = await yargsi
    .default(args)
    .showHelpOnFail(false)
    .strict()
    .parserConfiguration({ 'greedy-arrays': false })
    .command('$0 <inputExecpath> <outExecpath>', 'Compiles a Sass file')
    .positional('inputExecpath', { type: 'string', demandOption: true })
    .positional('outExecpath', { type: 'string', demandOption: true })
    .option('embedSources', { type: 'boolean' })
    .option('errorCss', { type: 'boolean' })
    .option('sourceMap', { type: 'boolean' })
    .option('loadPath', { type: 'array', string: true })
    .option('style', { type: 'string' })
    .parseAsync();

  const result = compile(inputExecpath, {
    style: style as OutputStyle,
    sourceMap,
    sourceMapIncludeSources: embedSources,
    loadPaths: loadPath,
    importers: [localPackageSassImporter],
  });

  await fs.promises.writeFile(outExecpath, result.css);
}
