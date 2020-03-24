import { relative } from '@angular-devkit/core';
import { DirEntry } from '@angular-devkit/schematics';

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

  protected _templateOptions() {
    return {
      ...this,
      tsFiles: this._tsFiles.map(f => relative(this.path, f.path)),
      htmlFiles: this._htmlFiles.map(f => relative(this.path, f.path))
    };
  }
}
