import { fragment } from '@angular-devkit/core';
import { DirEntry, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ShowcaseModule } from './showcase-module';

export class ShowcasePackage {
  private _appModule: ShowcaseModule;

  constructor(private _dir: DirEntry, private _tree: Tree, context: SchematicContext) {
    const appDir = this._dir.dir(fragment('app'));
    this._appModule = new ShowcaseModule(appDir, this._tree, context);
    this._appModule.dependencies.push(
      ...this._appModule
        .ngModules()
        .filter(m => m.path !== appDir.path)
        .map(m => `/${m.path}`)
    );
    this._appModule.dependencies.sort();
  }

  render(): Rule[] {
    return this._appModule.render();
  }
}
