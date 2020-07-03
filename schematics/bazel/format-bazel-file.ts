import { Path } from '@angular-devkit/core';
import { SchematicsException } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
import { randomBytes } from 'crypto';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
const { getNativeBinary } = require('@bazel/buildifier/buildifier');

const buildifierArguments = parseBuildifierArguments();

function parseBuildifierArguments() {
  const pckg = require('../../package.json');
  const script: string = pckg.scripts['bazel:buildifier'];
  if (!script) {
    throw new SchematicsException('Could not find script bazel:buildifier in package.json');
  }
  const args = script.split('xargs buildifier -v')[1];
  if (!args) {
    throw new SchematicsException(
      'Could not find `xargs buildifier -v` in bazel:buildifier in package.json'
    );
  }

  return `${args} --lint=fix --mode=fix`;
}

export function formatBazelFile(relativePath: Path, content: string) {
  const tmpPath = join(tmpdir(), `bazel_file_to_format_${randomBytes(32).toString('hex')}.bazel`);
  writeFileSync(tmpPath, content, 'utf8');
  const binary = getNativeBinary();
  execSync(`"${binary}" ${buildifierArguments} -path=${relativePath} "${tmpPath}"`);
  const result = readFileSync(tmpPath, 'utf8');
  unlinkSync(tmpPath);
  return result;
}
