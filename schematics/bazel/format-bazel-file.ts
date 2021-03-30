import { Path } from '@angular-devkit/core';
import { execSync } from 'child_process';
import { randomBytes } from 'crypto';
import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
const { getNativeBinary } = require('@bazel/buildifier/buildifier');

export function formatBazelFile(relativePath: Path, content: string) {
  const tmpPath = join(tmpdir(), `bazel_file_to_format_${randomBytes(32).toString('hex')}.bazel`);
  writeFileSync(tmpPath, content, 'utf8');
  const binary = getNativeBinary();
  execSync(`"${binary}" -path=${relativePath} "${tmpPath}"`);
  const result = readFileSync(tmpPath, 'utf8');
  unlinkSync(tmpPath);
  return result;
}
