import { dirname, fragment, Path } from '@angular-devkit/core';
import { DirEntry, Tree } from '@angular-devkit/schematics';

export interface BazelModuleDetector {
  isModuleDirectory(dir: DirEntry): boolean;
  findModuleBaseDirectory(dirOrFile: DirEntry | Path): DirEntry;
}

export abstract class BazelModuleDetectorBase implements BazelModuleDetector {
  constructor(private _tree: Tree) {}

  abstract isModuleDirectory(dir: DirEntry): boolean;
  findModuleBaseDirectory(dirOrFile: DirEntry | Path): DirEntry {
    let dir: DirEntry = !(typeof dirOrFile === 'string')
      ? (dirOrFile as DirEntry)
      : this._tree.getDir(dirname(dirOrFile));
    while (!this.isModuleDirectory(dir)) {
      dir = dir.parent!;
    }
    return dir;
  }
}

export class LibraryBazelModuleDetector extends BazelModuleDetectorBase {
  isModuleDirectory(dir: DirEntry): boolean {
    return dir.subfiles.includes(fragment('BUILD.bazel'));
  }
}

export class AppBazelModuleDetector extends BazelModuleDetectorBase {
  isModuleDirectory(dir: DirEntry): boolean {
    return dir.subfiles.some((f) => f.endsWith('.module.ts'));
  }
}
