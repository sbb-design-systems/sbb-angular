import { DirEntry, Tree } from '@angular-devkit/schematics';

import { BazelSchematicContext } from './bazel-schematic-context';
import { ShowcaseMergeModule } from './showcase-merge-module';
import { ShowcasePackage } from './showcase-package';

export class ShowcaseMergePackage extends ShowcasePackage {
  protected _appModule: ShowcaseMergeModule;

  constructor(dir: DirEntry, tree: Tree, context: BazelSchematicContext) {
    super(dir, tree, context);
    this._appModule = new ShowcaseMergeModule(this._appDir, tree, context);
  }
}
