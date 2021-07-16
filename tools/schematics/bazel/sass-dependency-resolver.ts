import { basename, dirname, join, logging, Path, relative } from '@angular-devkit/core';
import { DirEntry, FileEntry } from '@angular-devkit/schematics';

import { BazelModuleDetector } from './bazel-module-detector';
import { NpmDependencyResolver } from './npm-dependency-resolver';

export interface SassDependencyResolver {
  resolveDependencies(files: FileEntry[], dependencyBlocklist?: string[]): SassBinary[];
}

export interface SassBinary {
  name: string;
  path: string;
  dependencies: string[];
}

export class FlexibleSassDependencyResolver implements SassDependencyResolver {
  constructor(
    private _moduleDetector: BazelModuleDetector,
    private _npmDependencyResolver: NpmDependencyResolver,
    private _logger: logging.LoggerApi,
    private _dependencyByOccurence = new Map<string, string>()
  ) {}

  resolveDependencies(files: FileEntry[], dependencyBlocklist: string[] = []): SassBinary[] {
    return files.map((file) => {
      const moduleBaseDir = this._moduleDetector.findModuleBaseDirectory(file.path);
      const stylesheetPath = relative(moduleBaseDir.path, file.path);
      return {
        name: stylesheetPath.replace(/[^a-z0-9]/g, '_'),
        path: stylesheetPath,
        dependencies: this._findStylesheetDependencies(file, moduleBaseDir)
          .filter((v, i, a) => a.indexOf(v) === i)
          .filter((d) => !dependencyBlocklist.includes(d)),
      };
    });
  }

  private _findStylesheetDependencies(file: FileEntry, moduleDir: DirEntry) {
    const matches = file.content.toString().match(/(@import|@use) '([^']+)';/g);
    if (!matches) {
      return [];
    }
    return matches
      .map((s) => s.substring(9, s.length - 2))
      .map((importPath) => {
        const occurence = Array.from(this._dependencyByOccurence.keys()).find((o) =>
          importPath.includes(o)
        );
        if (occurence) {
          return this._dependencyByOccurence.get(occurence)!;
        } else if (this._isInModule(join(dirname(file.path), importPath), moduleDir)) {
          return `:${basename(moduleDir.path)}_scss_lib`;
        } else if (importPath.includes('/node_modules/')) {
          return this._npmDependencyResolver.toBazelNodeDependency(
            importPath.split('/node_modules/')[1]
          );
        } else if (importPath.includes('~')) {
          return this._npmDependencyResolver.toBazelNodeDependency(importPath.split('~')[1]);
        } else {
          this._logger.warn(`${file.path}: Could not resolve stylesheet import '${importPath}'`);
          return '';
        }
      })
      .filter((d) => !!d)
      .filter((v, i, a) => a.indexOf(v) === i);
  }

  private _isInModule(file: Path, moduleDir: DirEntry): boolean {
    const fileModule = this._moduleDetector.findModuleBaseDirectory(file);
    return moduleDir.path === fileModule.path;
  }
}
