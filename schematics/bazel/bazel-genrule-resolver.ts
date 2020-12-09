import { fragment } from '@angular-devkit/core';
import { DirEntry } from '@angular-devkit/schematics';

export class BazelGenruleResolver {
  private readonly _buildFile = fragment('BUILD.bazel');

  resolveGenrule(dir: DirEntry): string[] {
    if (!dir.subfiles.includes(this._buildFile)) {
      return [];
    }

    return (
      dir
        .file(this._buildFile)!
        .content.toString()
        .match(/\ngenrule\([\w\W]+?\n\)/gm) || []
    );
  }
}
