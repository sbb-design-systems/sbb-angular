/**
 * Script that will genrate .
 */

import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

if (require.main === module) {
  // The script expects the bazel-bin path as first argument. All remaining arguments will be
  // considered as markdown input files that need to be transformed.
  const [bazelBinPath] = process.argv.slice(2);

  // Walk through each input file and write transformed markdown output to the specified
  // Bazel bin directory.
  inputFiles.forEach(inputPath => {
    const outputPath = join(bazelBinPath, inputPath.replace(markdownExtension, '.html'));
    const htmlOutput = markdownRenderer.finalizeOutput(marked(readFileSync(inputPath, 'utf8')));

    writeFileSync(outputPath, htmlOutput);
  });
}
