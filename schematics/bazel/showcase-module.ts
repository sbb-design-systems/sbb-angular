import { dirname, join, relative } from '@angular-devkit/core';
import { DirEntry, FileEntry, SchematicsException } from '@angular-devkit/schematics';

import { NgModule } from './ng-module';

export class ShowcaseModule extends NgModule {
  protected _templateUrl = './files/showcaseModule';
  customTsConfig = '//src/showcase:tsconfig.json';

  protected _isModuleDir(dir: DirEntry) {
    return dir.subfiles.some(f => f.endsWith('.module.ts'));
  }

  protected _createSubModule(dir: DirEntry) {
    return new ShowcaseModule(dir, this._tree, this._context);
  }

  protected _resolveTsImport(importPath: string, fileEntry: FileEntry) {
    const path = super._resolveTsImport(importPath, fileEntry);
    if (path !== '') {
      return path;
    } else if (importPath.endsWith('/package.json')) {
      return '//:package.json';
    }

    const joinedPath = dirname(join(dirname(fileEntry.path), importPath));
    const importDir = this._tree.getDir(joinedPath);
    if (!importPath) {
      throw new SchematicsException(`Can't find '${importPath}' from '${fileEntry.path}'`);
    }

    let moduleDir = importDir;
    while (!this._isModuleDir(moduleDir)) {
      moduleDir = moduleDir.parent!;
    }

    if (moduleDir.path !== this.path) {
      return `/${moduleDir.path}`;
    }

    return '';
  }

  protected _templateOptions() {
    return {
      ...this,
      tsFiles: this._tsFiles.map(f => relative(this.path, f.path)),
      htmlFiles: this._htmlFiles.map(f => relative(this.path, f.path))
    };
  }
}
