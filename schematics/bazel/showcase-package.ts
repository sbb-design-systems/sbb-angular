import { DirEntry, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { NgModule } from './ng-module';
import { ShowcaseModule } from './showcase-module';

export class ShowcasePackage {
  private _appModule: NgModule;

  constructor(dir: DirEntry, tree: Tree, context: SchematicContext) {
    this._appModule = new ShowcaseModule(dir, tree, context);
  }

  render(): Rule[] {
    return this._appModule.render();
  }
}
