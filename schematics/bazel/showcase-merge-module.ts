import { DirEntry } from '@angular-devkit/schematics';

import { ShowcaseModule } from './showcase-module';

export class ShowcaseMergeModule extends ShowcaseModule {
  customTsConfig = '//src/showcase-merge:tsconfig.json';

  protected _createSubModule(dir: DirEntry) {
    return new ShowcaseMergeModule(dir, this._tree, this._context);
  }
}
