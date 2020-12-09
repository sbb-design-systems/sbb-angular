import { DirEntry } from '@angular-devkit/schematics';

import { NgModule } from './ng-module';

export class ShowcaseModule extends NgModule {
  protected _templateUrl = './files/showcaseModule';
  customTsConfig = '//src/showcase:tsconfig.json';

  protected _createSubModule(dir: DirEntry) {
    return new ShowcaseModule(dir, this._tree, this._context);
  }
}
